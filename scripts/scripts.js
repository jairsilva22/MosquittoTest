// aqui ponemos la direccion url y el puerto en este caso como se usar el web socket se usa el puerto 9001   ip local ws://192.168.100.61:9001 ip del servidor ws://74.208.24.130:9001
var brokerUrl = 'wss://app.samprasoee.com:1883'; 
var username= "calisis";
var  password= "calisis";
var topic = 'jkhkjhkjh';

var clientId="app.samprasoee.com";

// Conectarse al broker MQTT
var client = mqtt.connect(brokerUrl, {
    clientId: clientId,
    username:username,
    password:password,
    rejectUnauthorized: false
});

// Manejador cuando se conecta al broker
client.on('connect', function () {
    console.log('Conectado al broker MQTT');

    // Suscribirse al tema
    client.subscribe(topic, function (err) {
        if (!err) {
            console.log('Suscrito al tema:', topic);
        }
    });
});

// Manejador cuando se recibe un mensaje
client.on('message', function (receivedTopic, message) {
    if (receivedTopic === topic) {
        console.log('Mensaje recibido en el tema', receivedTopic, ':', message.toString());
        ActualizarGrafica(parseFloat(message.toString()));
        // Muestra el mensaje en la interfaz web
        MostrarMensaje(message.toString());
    }
});

// Manejador cuando se desconecta del broker
client.on('close', function () {
    console.log('Desconectado del broker MQTT');
});

// Manejador en caso de error
client.on('error', function (err) {
    console.error('Error en la conexión MQTT:', err);
});

//funcion que me grafica 

var chartData = {
    labels: [],
    datasets: [{
        label: 'Datos recibidos',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        data: []
    }]
};

var ctx = document.getElementById('graficaCanvas').getContext('2d');
var grafica = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: {
        scales: {
            x: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
    }
});

function  ActualizarGrafica(data) {
    chartData.labels.push(chartData.labels.length);
    chartData.datasets[0].data.push(data);
    grafica.update();
}

// Función para mostrar el mensaje en la interfaz web y agregarlo a la tabla
function MostrarMensaje(message) {
  
    var tabla = document.getElementById("tablaMensajes");
    var cuerpoTabla = tabla.getElementsByTagName('tbody')[0];

    // Crear una nueva fila
    var fila = cuerpoTabla.insertRow();

    // Agregar celda para el mensaje
    var celdaMensaje = fila.insertCell(0);
    celdaMensaje.textContent = message;
// Agregar celda para la fecha y hora actual
var celdaFechaHora = fila.insertCell(1);
var fechaHoraActual = new Date();
var fechaHoraTexto = fechaHoraActual.toLocaleString(); // Esto incluirá tanto la fecha como la hora

celdaFechaHora.textContent = fechaHoraTexto;

}
