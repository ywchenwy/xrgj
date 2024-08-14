import { baseURL, apiPrefix } from './config.js';
import { allSettled } from './utils.js';
const getJson = async (url, params = {}) => {
  try {
    // 将 params 对象转换为查询字符串
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(baseURL + apiPrefix + url + (queryString ? `?${queryString}` : ''), {
      method: 'GET',
    });

    // 检查响应状态码
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析 JSON 数据
    const data = await response.json();

    // 处理数据
    if (data.code === 1) {
      return data.data;
    } else {
      console.warn('Unexpected response code:', data.code);
      return null;
    }
  } catch (error) {
    // 处理错误
    console.error('Fetch error:', error);
    return null;
  }
};

const categoryIds = [1, 2, 3, 4, 5];
const categoryNames = ['Causal Dress', 'African Kaftan', 'Muslim abaya', 'Ready goods', 'Embroidery Kaftan'];

const querys = categoryIds.map((categoryId, index) =>
  getJson('/product/page', {
    page: 1,
    pageSize: 4,
    categoryId,
  }).then(data => {
    if (!data) return '';
    const categoryName = categoryNames[index];
    const productItems = data.records.map((item, index) => `
      <div class="col-lg-3 col-6 wow fadeInUp" data-wow-delay="${(index + 1) * 0.2}s">
          <div class="product-item">
              <div class="product-img">
                  <img src="/oss/${item.imgPath}" class="img-fluid w-100 rounded-top" alt="Image">
              </div>
              <div class="product-content bg-light text-center rounded-bottom p-3">
                  <a href="#" class="h6 d-inline-block mb-2">${item.name}</a>
                  <p class="fs-6 text-primary mb-2">
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                      <i class="fas fa-star"></i>
                  </p>
                  <a href="#" class="btn btn-secondary rounded-pill py-2 px-4">More</a>
              </div>
          </div>
      </div>`);
    const product = `
      <div class="container-fluid product py-5 ${index % 2 === 0 ? '' : 'bg-light'}">
          <div class="container py-4">
              <div class="text-left w-100 pb-4 wow fadeInUp" data-wow-delay="0.2s" style="max-width: 800px;">
                  <h1 class="display-3 text-capitalize">${categoryName}</h1>
                  <h4 class="text-uppercase text-primary">Our Products</h4>
              </div>
              <div class="row g-4 justify-content-center">
                  ${productItems.join('')}
              </div>
          </div>
      </div>`;
    return product;
  })
)

allSettled(querys).then(results => {
  const indexProduct = document.querySelector('.index-product');
  indexProduct.innerHTML = '';
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      indexProduct.innerHTML += result.value;
    }
  })
})
