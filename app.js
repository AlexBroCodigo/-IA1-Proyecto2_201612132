'use strict';
// Cargar Google Charts
google.charts.load('current', {packages: ['corechart']});

// Variables globales
let selectedModel = 'regresionLineal';
let modelInstance;
let trainingDataX = [];
let trainingDataY = [];
let rangoDataX = [];
let predictionsY = [];
let predictionsY2 = [];
let predictionsY3 = [];
let datakMeans = [];
let numClustersK = 0;
let data = [];

// ************************************ FUNCIONES AUXILIARES ****************************************************
// Función para unir el array a graficar en regresion polinomial
function joinArraysPolinomial() {
    let a = [];
    if (arguments.length == 10) {
        a.push([arguments[0], arguments[2], arguments[4], arguments[6], arguments[8]]);
        for (let i = 0; i < arguments[1].length; i++) {
            a.push([arguments[1][i], arguments[3][i], arguments[5][i], arguments[7][i], arguments[9][i]]);
        }
    }
    return a;
}

// Función para parsear CSV
function parseCSV(data) {
    return data.trim().split("\n").map(row => row.split(","));
}

// Función para ajustar parametros según el modelo seleccionado
document.getElementById('modelSelect').addEventListener('change', function() {
    let modelSelect = document.getElementById('modelSelect');
    selectedModel = modelSelect.value;

    const div_rangex_regresion = document.getElementById('div_rangex_regresion');
    const div_numclases_means = document.getElementById('div_numclases_means');
    const chart_div = document.getElementById('chart_div');
    const canvas_div = document.getElementById('canvas_div');
    
    if (selectedModel === "regresionLineal" || selectedModel === "regresionPolinomial") {
        div_rangex_regresion.style.display = "inline-block"; // Muestra el div del rango de X
        div_numclases_means.style.display = "none"; // Muestra el div del número de clases K
        chart_div.style.display = "inline-block";
        canvas_div.style.display = "none"; 
        
    }
    else if(selectedModel == "kmeans") {
        div_rangex_regresion.style.display = "none"; // Muestra el div del rango de X
        div_numclases_means.style.display = "inline-block"; // Muestra el div del número de clases K
        chart_div.style.display = "none"; 
        canvas_div.style.display = "inline-block";
    }
});


// ************************************ FUNCIONES BOTONES ****************************************************
// FUNCION CARGAR ARCHIVO: para cargar el archivo CSV y procesar los datos
document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const dataset = parseCSV(content);

        if(selectedModel === "regresionLineal" || selectedModel === "regresionPolinomial"){
            trainingDataX = dataset.map(row => parseFloat(row[0]));
            trainingDataY = dataset.map(row => parseFloat(row[1]));
            console.log('trainingDataX:',trainingDataX);
            console.log('trainingDataY:',trainingDataY);
            alert("Archivo cargado correctamente."); 
        }
        else if(selectedModel === "kmeans"){
            datakMeans = dataset.map((subArray) => {
                return subArray.map((value) => parseInt(value.trim(), 10));
            });
            console.log('datakMeans:',datakMeans);
            alert("Archivo cargado correctamente.");
        }
    };
    reader.readAsText(file);
});


// FUNCION ENTRENAR: para entrenar el modelo
document.getElementById("trainButton").addEventListener("click", function() {
    if (trainingDataX.length === 0 && trainingDataY.length === 0 && datakMeans.length === 0) {
        alert("Por favor carga un archivo CSV primero.");
        return;
    }

    if (selectedModel === "regresionLineal") {
        modelInstance = new LinearRegression();
        modelInstance.fit(trainingDataX, trainingDataY);
        alert(`Modelo entrenado correctamente.\n trainingDataX: ${trainingDataX}\n trainingDataY: ${trainingDataY}`);
    }
    else if (selectedModel === "regresionPolinomial"){
        modelInstance = new PolynomialRegression();
        alert(`Modelo entrenado correctamente.\n trainingDataX: ${trainingDataX}\n trainingDataY: ${trainingDataY}`);
    }
    else if (selectedModel === "kmeans") {
        alert("Modelo entrenado correctamente.");
    }
});



// FUNCION PREDICCION: predicción al hacer clic en el botón
document.getElementById("predictButton").addEventListener("click", function() {
    if (!modelInstance && (selectedModel === "regresionLineal" || selectedModel === "regresionPolinomial")) {
        alert("Por favor entrena el modelo primero.");
        return;
    }
    let rangeInputX = '';
    if(selectedModel === "regresionLineal" || selectedModel === "regresionPolinomial"){
        // Expresión regular: secuencia de números enteros separados por comas
        const regex = /^(\d+,)*\d+$/;
        rangeInputX = document.getElementById("rangeInputX").value;
        if (rangeInputX === "") {
            alert("Por favor ingrese el rango de valores X a predecir.");
            return;
        } else if (!regex.test(rangeInputX)) {
            alert("Formato incorrecto. Por favor ingrese solo números enteros separados por comas.");
            return;
        }
    }
    else if(selectedModel === "kmeans"){
        if(datakMeans.length === 0) {
            alert("Por favor carga un archivo CSV primero.");
            return;
        }
    }

    if(selectedModel === "regresionLineal"){   
        rangoDataX = rangeInputX.split(",").map(value => parseFloat(value.trim()));
        console.log('rangoDataX:',rangoDataX);
        predictionsY = modelInstance.predict(rangoDataX);
        console.log('predictionsY:',predictionsY);
        alert(`Predicción realizada correctamente.\npredictionsY: ${predictionsY}`);
    }
    else if (selectedModel === "regresionPolinomial") {
        rangoDataX = rangeInputX.split(",").map(value => parseFloat(value.trim()));
        modelInstance.fit(trainingDataX, trainingDataY, 2);
        predictionsY = modelInstance.predict(rangoDataX);
        modelInstance.fit(trainingDataX, trainingDataY, 3);
        predictionsY2 = modelInstance.predict(rangoDataX);
        modelInstance.fit(trainingDataX, trainingDataY, 4);
        predictionsY3 = modelInstance.predict(rangoDataX);
        for (let i = 0; i < rangoDataX.length; i++) {
            predictionsY[i] = Number(predictionsY[i].toFixed(2));
            predictionsY2[i] = Number(predictionsY2[i].toFixed(2));
            predictionsY3[i] = Number(predictionsY3[i].toFixed(2));
        }
        alert(`Predicción realizada correctamente.\npredictionsY: ${predictionsY}\npredictionsY2: ${predictionsY2}\npredictionsY3: ${predictionsY3}`);
    }
    else if (selectedModel === "kmeans"){
        alert(`Predicción realizada correctamente.`);
    }
    
});



// FUNCION VER GRAFICAS: al hacer clic en el botón
document.getElementById("showGraphButton").addEventListener("click", function() {
    if (!modelInstance && (selectedModel === "regresionLineal" || selectedModel === "regresionPolinomial")){
        alert("Por favor entrena el modelo primero.");
        return;
    }
    else if(predictionsY.length === 0 && (selectedModel === "regresionLineal" || selectedModel === "regresionPolinomial")){
        alert("Por favor predice el modelo primero.");
        return;
    }
    else if(selectedModel === "kmeans"){
        if(datakMeans.length === 0) {
            alert("Por favor carga un archivo CSV primero.");
            return;
        }
        const cadClustersK = document.getElementById("numClustersK").value;
        if(cadClustersK === ""){
            alert("Por favor ingrese el número de clases o clusters por favor.");
            return;
        }
        numClustersK = parseInt(cadClustersK);
    }

    if(selectedModel === "regresionLineal"){
        drawChartRegresionLineal();
    }
    else if(selectedModel === "regresionPolinomial"){
        drawChartRegresionPolinomial();
    }
    else if(selectedModel === "kmeans"){
        drawChartKMeans();
    }
});


function drawChartRegresionLineal() {
    let data = joinArrays('Rango X',rangoDataX,'Entreno Y',trainingDataY,'Predicción Y',predictionsY)
    let chartData = google.visualization.arrayToDataTable(data);
    var options = {
        seriesType : 'scatter',
        series: {1: {type: 'line'}},
        title: 'Modelo: Regresión Lineal',
        hAxis: { title: 'Rango de valores de X' },
        vAxis: { title: 'Entrenamiento y Predicción de Y' },
        legend: 'BroLegend'
    };  
    var chart = new google.visualization.ComboChart(document.getElementById('chart_div'));
    chart.draw(chartData, options);         
}

function drawChartRegresionPolinomial(){
    let data = joinArraysPolinomial('Rango X', rangoDataX, 'Entreno Y', trainingDataY, 'Predicción Grado 2', predictionsY, 'Predicción Grado 3', predictionsY2, 'Predicción Grado 4', predictionsY3);
    var chartData = google.visualization.arrayToDataTable(data);
    var options = {
      seriesType: "scatter",
      series: {
        1: { type: "line" },
        2: { type: "line" },
        3: { type: "line" },
      },
      title: "Modelo: Regresión Polinomial",
      hAxis: { title: "Rango de valores de X" },
      vAxis: { title: "Entrenamiento y Predicciones de Y" },
      legend: "BroLegend",
    };
    var chart = new google.visualization.ComboChart(document.getElementById("chart_div"));
    chart.draw(chartData, options);
}

function drawChartKMeans() {
    //Reinciamos el canvas
    const canvas = document.getElementById("chart_kmeans_div");
    // Reiniciar el tamaño del canvas para limpiarlo
    canvas.width = canvas.width;
    canvas.height = canvas.height;

    // Opcional: Restablece el tamaño original si necesitas un tamaño específico
    canvas.width = 600;
    canvas.height = 600;
    document.getElementById("datos_canvas").innerHTML = "";

    //Creamos la imagen
    data = datakMeans;
    let kmeanss = new G8_Kmeans({
        canvas: document.getElementById("chart_kmeans_div"),
        data: data,
        k: numClustersK,
    });

    for (let i = 0; i < kmeanss.means.length; i++) {
        document.getElementById("datos_canvas").innerHTML +=
        "<p>Centroide Cluster ".concat(i, ": ", kmeanss.means[i].concat("<p>"));
    }
}