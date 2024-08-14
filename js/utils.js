// 手写Promise.allSettle()
export const allSettled = (promises) => {
  return new Promise((resolve, reject) => {
    const results = []
    const len = promises.length
    if (!len) resolve(results)
    let resolvedCount = 0
    for (let i = 0; i < len; i++) {
      promises[i]
        .then((value) => {
          results[i] = { status: "fulfilled", value }
        })
        .catch((reason) => {
          results[i] = { status: "rejected", reason }
        })
        .finally(() => {
          resolvedCount++
          if (resolvedCount === len) {
            resolve(results)
          }
        })
    }
  })
}