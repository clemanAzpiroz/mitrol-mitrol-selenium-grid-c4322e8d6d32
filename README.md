Versión: 1.0.0
# Antes de Ejecutar los test #
## Kubernetes ##

Chequear la configuración del cluster ingresando por ssh a la VM que lo controla

`ssh mituser@192.168.40.40 -p 2543`

En el directorio __/home/playwright__ se puede encontrar el archivo __playwright-grid-deployment.yaml__ que será necesario para hacer el deployment de los browsers dentro del cluster. 

En este directorio ponemos:
 - Para levantar el deployment.
`kubectl apply -f playwright-grid-deployment.yaml`

 - Para bajarlo.
`kubectl delete -f playwright-grid-deployment.yaml`

Para reiniciarlo se puede utilizar el script __restart-grid__ ejecutando:
`bash restart-grid.sh`

También se puede editar el valor de la variable de ambiente  __SESSION_TIMEOUT__ para obligar a los nodos a cerrar los browsers activos después de cierto tiempo, este se debe expresar en segundos. Ejemplo: Timeout de 20 minutos

`- name: SE_NODE_SESSION_TIMEOUT
   value: "1200"`
	
Si se quiere reiniciar directamente las VM's se puede utilizar el script rest-vms.sh ingresando manualmente la contaseña sudo de cada conexión ssh.

`bash reset-vms.sh`
- - -
# Dependencias #
## Instalación ##
>#### NodeJs ####
>> Instalar NodeJs y npm.

>> [Linux](https://kinsta.com/es/blog/como-instalar-node-js/)

>> [Windows / Mac](https://nodejs.org/es/download/)

> #### Yarn ####
>> __Instalar vía npm__

>> Una vez instalado NodeJs, en una terminal ejecutar: 

>> `npm install --global yarn`

>> Chequear la instalación: `yarn --version`

Para instalar las dependencias necesarias para ejecutar los test abrir una terminal en el directorio principal del proyecto y ejecutar: 

`yarn install`

- - -
# PlayWright #
### Configuración ###

Por defecto la url del grid es: http://192.168.40.40:30001/, el puerto se puede cambiar desde el yaml en el item nodePort del service selenium-router. La url se puede cambiar desde la variable de ambiente SELENIUM_REMOTE_URL=.

### Conceptos Básicos ##

* WebDriver: Es la interfaz básica para simular las interacciones del usuario con cualquier navegador, ya sea Chrome, Firefox, etc.
* Selenium Grid: Es una extensión de WebDriver que permite la ejecución de pruebas de forma distribuida en distintos navegadores. Se compone principalmente de Selenium HUB y NODOS.
* Selenium Hub: Este componente recibe las órdenes de ejecución de los tests y coordina a múltiples servidores para ejecutar los test en los distintos nodos de nuestra red. Asegura que las peticiones de los tests se carguen balanceadamente y direcciona las peticiones de cada test al nodo apropiado.
* Nodo: Es una máquina virtual que combina distintos navegadores para su uso en el grid. 

![Aler text](https://i.imgur.com/MzkVmsR.jpeg)

También muchas veces las instrucciones que se deben realizar se vuelven repetitivas y reescribir estos códigos vuelven el test poco legible, para evitar esto contamos con el archivo *utils* que  contiene funciones y procedimientos preestablecidos para la realización de un test más ágil y fácil.

## playwright.config.ts ##
El archivo de configuración de playwright nos permite personalizar ciertos aspectos y funciones del framework, los más destacados son:

- [ __reporter__](https://playwright.dev/docs/test-reporters)
- [ __screenshot__ ](https://playwright.dev/docs/test-configuration#automatic-screenshots)
- [ __video__ ](https://playwright.dev/docs/test-configuration#record-video)

También se pueden configurar los distintos TimeOuts.

### Como escribir un test ###
__Proximamente.__
- - -
## EjECUCION Y CONFIGURACION DE LOS TEST ##
### CUSTOM FLAGS ###
```
.
-l: Indica que el test se va a ejecutar de forma local y no en el grid.
-t: Sirve para indicar el test que se va a ejecutar.
-u: Permite cambiar la el ambiente de ejecución del test.
-w: En los test de carga sirve para indicar la cantidad de navegadores que se desea utilizar. Solo tendrá efecto en este tipo de test.
```

### E2E ###
__No usar la flag -w a menos que se comprenda el efecto que causa__

- #### Test de forma local ####

`yarn custom -l -t nombre-del-test.spec.ts`

- #### Test de forma remota (grid) ####

`yarn custom -t nombre-del-test.spec.ts`

- #### Test de forma local + cambio de ambiente ####

`yarn custom -l -t nombre-del-test.spec.ts -u https://url.test/`

## TESTS DE CARGA ##
  
__Pasar los workers(-w) solo en el variable a menos que se comprenda el efecto que causa__

#### ! No recomendada la ejecución de test de carga de forma local ! ####

### TEST DE CARGA PRE-SETEADOS ###

__Caso:__ 50 agentes que siempre van a iniciar sesión y con estado disponible.
__Duración__: 10 minutos.
` yarn custom -t 50-agentes-10-min.spec.ts`

__Caso:__ 100 agentes que siempre van a iniciar sesión y con estado disponible.
__Duración__: 20 minutos.
` yarn custom -t 100-agentes-20-min.spec.ts `

__Caso:__ 150 agentes que siempre van a iniciar sesión y con estado disponible.
__Duración__: 60 minutos.
` yarn custom -t 150-agentes-60-min.spec.ts `
## test.config.ts ##
Este archivo permite personalizar el test __carga-variable.spec.ts__

- __url:__ Ambiente en el que se desea realizar la prueba
- __frecuenciaFija:__ Frecuencia en la que se realiza la comprobación de inicio de sesión y cambio de estado en ms. Setear undefined si se desea utilizar la frecuenciaVariable.
- __duracion:__ Duración total del test en ms
- __frecuenciaVariable:__ Permite espaciar de forma variable la comprobación de inicio de sesión y cambio de estado. Para utilizar la frecuencia variable se debe setear frecuenciaFija: undefined

### Ejemplo ###
#### Configurando ####
```
.
  url: process.env.URL
    ? process.env.URL
    : "https://qa4-int-web-ar.mitrol.net/webpad/",
  frecuenciaFija: 40 * 1000,
  duracion: 30 * 60 * 1000,
  workers: parseInt(process.env.MAX || "1"),
```
#### Ejecutando ####
`yarn custom -w 2 -t carga-variable.spec.ts`

#### Efecto: ####
Este test va a ejecutar 2 browser __(-w 2)__ que van a ingresar al ambiente QA4 __(url: qa4)__ y cada 40 segundos __(frecuenciaFija: 40 * 1000)__ van a chequear que el agente que se le asignó a cada instancia de navegador haya iniciado sesión correctamente y se encuentre en estado disponible, caso contrario realizara los pasos necesarios para iniciar sesión y cambiar el estado. La duración total será de 30 minutos __(duracion: 30 * 60 * 1000)__ y pasado ese tiempo cada instancia se cerrará.

__Lo mismo pero con 100 navegadores (100 agentes)__
`yarn custom -w 100 -t carga-variable.spec.ts`

- - -
# RECOMENDACIONES #

- #### ! NO EJECUTAR TEST DE CARGA DE FORMA LOCAL ! ####
- #### ! BAJAR Y SUBIR EL DEPLOYMENT DESPUES DE HACER 2 O 3 TESTS DE CARGA ! ####
- #### ! ANTE UN COMPORTAMIENTO INDESEADO O UNA MALA EJECUCION DEL TEST REINICIAR EL DEPLOYMENT ! ####
- #### ! EVITAR REINICIAR LAS VM'S, EN CASO DE HACERLO AVISAR ! ####


# Documentación sugerida #
[Playwright](https://playwright.dev/)
[Configuracion](https://playwright.dev/docs/test-configuration)
[Browsers](https://playwright.dev/docs/browsers)
[Borwser Context](https://playwright.dev/docs/browser-contexts)

- - -


# Maquinas Virtuales #
User: __mituser__
Pass: __mitcall__
Port: __2543__

### SELENIUM GRID
__AR-SEL-HUB-001__ 

`192.168.40.40` 
  
__AR-SEL-NODE-001__

`192.168.40.41`
  
__AR-SEL-NODE-002__

`192.168.40.42`
  
__AR-SEL-NODE-003__

`192.168.40.43`
  
__AR-SEL-NODE-004__

`192.168.40.44`
  
__AR-SEL-NODE-005__

`192.168.40.45`
  
__AR-SEL-NODE-006__

`192.168.40.46`
### CLIENTE
__AR-SEL-TEST-001__

`192.168.40.47`
- - -


# Lista de Users:

chat.spec	                Selenium 1 y 2
mensaje-interno.spec	    Selenium 3 y 4
login-agente.spec	        Selenium 5
historial.spec	          Selenium 6 ,7 y 8
preview.spec	            Selenium 11 y 12
pantalla-de-mensajes.spec	Selenium 13
pantalla-de-llamar.spec	  Selenium 14
seleccion-de-idioma.spec 	Selenium 15
pantalla-de-pendientes 	  Selenium 16
barra-izquierda.spec	    Selenium 17
cambio-de-estado.spec	    Selenium 18
discador-predictivo.spec	Selenium 19, 20 y 21
10-agentes.spec	          Selenium 30 al 40
login-10min.spec	        Selenium 50 al 60

! NO CORRER EN PARALELO LOS TEST SI SE REDUCEN LA CANTIDAD DE USUARIOS !
En el archivo de configuracion de playwright se encuentra la propiedad __fullyParallel__ seteada en false, esto mantiene la ejecucion de test en serie.
Mantener dentro del test: __test.describe.configure({ mode: "parallel" });__ para que los que correspondan se ejecuten en paralelo (test con mas de 2 browsers en ejecucion.)

Para ejecutar en serie los test limitar la cantidad de workers a 1. Por ejemplo:
yarn custom -l -w 1 -t

Esto ejecuta todos los test dentro de la carpeta e2e en serie.