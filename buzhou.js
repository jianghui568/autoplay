
// 1、打印出所有期号
const listItems = document.querySelectorAll('.ball-history-list-SSC li');
document.querySelectorAll('.recently-list-body li');


// 遍历每个 li
listItems.forEach(li => {
    // 提取期号
    const qihao = li.querySelector('.qihao').textContent.trim();

    // 提取所有奖号并拼接成字符串
    const numbers = Array.from(li.querySelectorAll('.jianghaoList .jianghao'))
        .map(span => span.textContent.trim())
        .join(',');

    // 按格式输出
    console.log(`${qihao} ： ${numbers}`);
});



setInterval(() => {
    const listItems = document.querySelectorAll('.ball-history-list-SSC li');

// 遍历每个 li
    listItems.forEach(li => {
        // 提取期号
        const qihao = li.querySelector('.qihao').textContent.trim();
        // 提取所有奖号并拼接成字符串
        const numbers = Array.from(li.querySelectorAll('.jianghaoList .jianghao'))
            .map(span => span.textContent.trim())
            .join(',');
        // 按格式输出
        console.log(`${qihao} ： ${numbers}`);
    });
}, 2000);
