let c, c2;
let ctx, ctx2;
let img, img2;
let imageData;

let cords = {
}



function init() {
  c = document.getElementById("myCanvas");
  ctx = c.getContext("2d");
  c2 = document.getElementById("myCanvas2");
  ctx2 = c2.getContext("2d");
  img = document.getElementById("img");
  img2 = document.getElementById("img2");
  c.width = img.width;
  c.height = img.height;
  c2.width = img2.width;
  c2.height = img2.height;
  cords = {
    x0: 0,
    x1: img.width,
    y0: 0,
    y1: img.height,
  }
  document.getElementById("x1").value = img.width;
  document.getElementById("y1").value = img.height;

  ctx2.drawImage(img2, 0, 0, c2.width, c2.height);
  imageData = drawImage();
  window.addEventListener("resize", () => {
    let img = document.getElementById("img");
    let img2 = document.getElementById("img2");
    c.width = img.width;
    c.height = img.height;

    c2.width = img2.width;
    c2.height = img2.height;

    drawImage();
    drawImage2();
  });
  document.getElementById("allRed").addEventListener("click", () => {
    allRed(drawImage());
  });
  document.getElementById("toNegative").addEventListener("click", () => {
    toNegative(drawImage());
  });
  document.getElementById("toGray").addEventListener("click", () => {
    toGray(drawImage());
  });
  document.getElementById("treshold").addEventListener("click", () => {
    treshold(drawImage());
  });
  document.getElementById("gamaCorr").addEventListener("click", () => {
    gamaCorr(drawImage(), document.getElementById("gamaInput").value);
  });
  document.getElementById("redSlider").addEventListener("change", () => {
    changeRGB(drawImage());
  });
  document.getElementById("greenSlider").addEventListener("change", () => {
    changeRGB(drawImage());
  });
  document.getElementById("blueSlider").addEventListener("change", () => {
    changeRGB(drawImage());
  });
  document.getElementById("refresh1").addEventListener("click", () => {
    document.getElementById("greenSlider").value = 0;
    document.getElementById("redSlider").value = 0;
    document.getElementById("blueSlider").value = 0;
    drawImage();
  });
  document.getElementById("refresh2").addEventListener("click", () => {
    document.getElementById("greenSlider").value = 0;
    document.getElementById("redSlider").value = 0;
    document.getElementById("blueSlider").value = 0;
    imageData = drawImage();
  });
  document.getElementById("box").addEventListener("click", () => {

    filtering(imageData, [1, 1, 1, 1, 1, 1, 1, 1, 1], 1 / 9);
    ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
  });
  document.getElementById("sobel").addEventListener("click", () => {
    filtering(imageData, [1, 2, 1, 0, 0, 0, -1, -2, -1], 1);
    ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
  });
  document.getElementById("laplac").addEventListener("click", () => {
    filtering(imageData, [0, -1, 0, -1, 4, -1, 0, -1, 0], 1);
    ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
  });
  document.getElementById("gaus").addEventListener("click", () => {
    filtering(imageData, [1, 2, 1, 2, 4, 2, 1, 2, 1], 1 / 16);
    ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
  });
  document.getElementById("mediana").addEventListener("click", () => {
    mediana(drawImage());
  });
  document.getElementById("hibridna").addEventListener("click", () => {
    hybrid(drawImage(), drawImage2());
  });
  document.getElementById("unsharp").addEventListener("click", () => {
    unsharp(drawImage());

  });
  document.getElementById("cord").addEventListener("click", () => {
    let x0 = document.getElementById("x0");
    let x1 = document.getElementById("x1");
    let y0 = document.getElementById("y0");
    let y1 = document.getElementById("y1");


    if (x0 > x1 || y0 > y1 || x1 > img.width || y1 > img.height) {
      alert("Vnos kordinat ni pravilen.");
    }

    cords.x0 = x0.value;
    cords.x1 = x1.value >= img.width ? img.width : x1.value;
    cords.y0 = y0.value;
    cords.y1 = y1.value >= img.height ? img.height : y1.value;

  });

  document.getElementById("refresh3").addEventListener("click", () => {
    document.getElementById("x0").value = 0;
    document.getElementById("x1").value = img.width;
    document.getElementById("y0").value = 0;
    document.getElementById("y1").value = img.height;
  })
}

function drawImage() {
  ctx.drawImage(img, 0, 0, c.width, c.height);
  return ctx.getImageData(0, 0, img.width, img.height);
}

function drawImage2() {
  ctx2.drawImage(img2, 0, 0, c2.width, c2.height);
  return ctx2.getImageData(0, 0, img2.width, img2.height);
}

function allRed(imageData) {
  let data = imageData.data;

  for (let i = 0, n = data.length; i < n; i += 4) data[i] = 255;

  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}

function toNegative(imageData) {
  let data = imageData.data;

  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i] = 255 - data[i];
    data[i + 1] = 255 - data[i + 1];
    data[i + 2] = 255 - data[i + 2];
  }
  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}

function toGray(imageData) {
  let data = imageData.data;
  let offset;

  for (let i = 0; i < imageData.height; i++) {
    for (let j = 0; j < imageData.width; j++) {
      offset =
        0.34 * data[4 * j + 4 * i * imageData.width] +
        0.5 * data[4 * j + 4 * i * imageData.width + 1] +
        0.16 * data[4 * j + 4 * i * imageData.width + 2];
      data[4 * j + 4 * i * imageData.width] = offset;
      data[4 * j + 4 * i * imageData.width + 1] = offset;
      data[4 * j + 4 * i * imageData.width + 2] = offset;
    }
  }

  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}

function treshold(imageData) {
  let data = imageData.data;
  let offset;

  for (let i = 0, n = data.length; i < n; i += 4) {
    offset = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];

    if (offset > 128) {
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}

function gamaCorr(imageData, gamma = 0.05) {
  let data = imageData.data;
  let gammaCorr = 1.0 / gamma;




  for (let i = 0, n = data.length; i < n; i += 4) {
    let r = data[i] / 255;
    let g = data[i + 1] / 255;
    let b = data[i + 2] / 255;

    data[i] = 255.0 * Math.pow(r, gammaCorr);
    data[i + 1] = 255.0 * Math.pow(g, gammaCorr);
    data[i + 2] = 255.0 * Math.pow(b, gammaCorr);
  }

  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}

function changeRGB(imageData) {
  let data = imageData.data;

  for (let i = 0, n = data.length; i < n; i += 4) {
    data[i] = data[i] - document.getElementById("redSlider").value;
    data[i + 1] = data[i + 1] - document.getElementById("greenSlider").value;
    data[i + 2] = data[i + 2] - document.getElementById("blueSlider").value;
  }
  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}

function filtering(imageData, matrix, multiplier) {
  let values = [0, 0, 0];
  let originalData = [...imageData.data];
  let data = imageData.data;

  for (let i = cords.y0; i < cords.y1 - 1; i++) {
    for (let j = cords.x0; j < cords.x1 - 1; j++) {
      // 4 * x  +  4 * y * imgWidth

      for (let ofs = 0; ofs < 3; ofs++) {
        values[ofs] += matrix[0] * originalData[4 * ((j - 4) + (i - 1) * img.width) + ofs];
        values[ofs] += matrix[1] * originalData[4 * (j + (i - 1) * img.width) + ofs];
        values[ofs] += matrix[2] * originalData[4 * ((j + 4) + (i - 1) * img.width) + ofs];

        values[ofs] += matrix[3] * originalData[4 * ((j - 4) + i * img.width) + ofs];
        values[ofs] += matrix[4] * originalData[4 * (j + i * img.width) + ofs];
        values[ofs] += matrix[5] * originalData[4 * ((j + 4) + i * img.width) + ofs];

        values[ofs] += matrix[6] * originalData[4 * ((j - 4) + (i + 1) * img.width) + ofs];
        values[ofs] += matrix[7] * originalData[4 * (j + (i + 1) * img.width) + ofs];
        values[ofs] += matrix[8] * originalData[4 * ((j + 4) + (i + 1) * img.width) + ofs];

        values[ofs] *= multiplier;
      }

      data[4 * (j + i * img.width)] = values[0];
      data[4 * (j + i * img.width) + 1] = values[1];
      data[4 * (j + i * img.width) + 2] = values[2];
      values[0] = 0;
      values[1] = 0;
      values[2] = 0;
    }
  }
  return imageData.data;
}

function mediana(imageData) {
  let originalData = [...imageData.data];
  let data = imageData.data;
  let values = [[], [], []];

  for (let i = 1; i < img.height - 1; i++) {
    for (let j = 4; j < img.width - 4; j++) {
      for (let off = 0; off < 3; off++) {
        values[off] = [
          originalData[4 * ((j - 4) + (i - 1) * img.width) + off],
          originalData[4 * (j + (i - 1) * img.width) + off],
          originalData[4 * ((j + 4) + (i - 1) * img.width) + off],

          originalData[4 * ((j - 4) + i * img.width) + off],
          originalData[4 * (j + i * img.width) + off],
          originalData[4 * ((j + 4) + i * img.width) + off],

          originalData[4 * ((j - 4) + (i + 1) * img.width) + off],
          originalData[4 * (j + (i + 1) * img.width) + off],
          originalData[4 * ((j + 4) + (i + 1) * img.width) + off],
        ];

        values[off].sort((a, b) => {
          return a - b;
        });
      }

      data[4 * (j + i * imageData.width)] = values[0][4];
      data[4 * (j + i * imageData.width) + 1] = values[1][4];
      data[4 * (j + i * imageData.width) + 2] = values[2][4];
    }
  }
  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}

function hybrid(imageData, imageData2) {
  let dataTmp = [...imageData.data];

  let data = filtering(imageData, [0, -1, 0, -1, 4, -1, 0, -1, 0], 1);
  let data2 = filtering(imageData2, [1, 2, 1, 2, 4, 2, 1, 2, 1], 1 / 16);


  for (let i = 1; i < img.height - 1; i++) {
    for (let j = 1; j < img.width - 1; j++) {
      data[4 * j + 4 * i * imageData.width] = dataTmp[4 * j + 4 * i * img.width] - data[4 * j + 4 * i * img.width] + data2[4 * j + 4 * i * img2.width];
      data[4 * j + 4 * i * imageData.width + 1] = dataTmp[4 * j + 4 * i * img.width + 1] - data[4 * j + 4 * i * img.width + 1] + data2[4 * j + 4 * i * img2.width + 1];
      data[4 * j + 4 * i * imageData.width + 2] = dataTmp[4 * j + 4 * i * img.width + 2] - data[4 * j + 4 * i * img.width + 2] + data2[4 * j + 4 * i * img2.width + 2];
    }
  }
  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
  ctx2.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}

function unsharp(imageData) {

  let dataTmp = [...imageData.data];

  //odšteješ box filter od originalne slike
  let data = filtering(imageData, [1, 1, 1, 1, 1, 1, 1, 1, 1], 1 / 9);


  for (let i = 1; i < img.height - 1; i++) {
    for (let j = 1; j < img.width - 1; j++) {
      data[4 * j + 4 * i * imageData.width] = dataTmp[4 * j + 4 * i * img.width] + (dataTmp[4 * j + 4 * i * img.width] - data[4 * j + 4 * i * img.width]);
      data[4 * j + 4 * i * imageData.width + 1] = dataTmp[4 * j + 4 * i * img.width + 1] + (dataTmp[4 * j + 4 * i * img.width + 1] - data[4 * j + 4 * i * img.width + 1]);
      data[4 * j + 4 * i * imageData.width + 2] = dataTmp[4 * j + 4 * i * img.width + 2] + (dataTmp[4 * j + 4 * i * img.width + 2] - data[4 * j + 4 * i * img.width + 2]);
    }
  }
  ctx.putImageData(imageData, 0, 0, cords.x0, cords.y0, cords.x1, cords.y1);
}