const colors = ["red", "green", "blue"];

const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
};

module.exports = randomColor;