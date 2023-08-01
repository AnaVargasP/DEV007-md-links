<p align="center">
  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiiGsbQanF-jL-4ITWdOCxnfqF_4M_M8xQyyuWlTIOrnkMup79LF3smR01iDMusi-yBxx8baiRZvK0eG9t1STJgbJ21-OjIro-Y9Q3d3bT0fKD5Txm5afzqERJbYKPKxVjh47SRqHlKf1wc_4_zEyfn1M5BbodRe_p3j9W9cD0PgCazxTXKl1HtkSLzEw8/w629-h210/CINE%20TRIVIA.png" alt="md-links" width="650" height="220">
</p>


## 1. Preámbulo

[Markdown](https://es.wikipedia.org/wiki/Markdown) es un lenguaje de marcado
ligero muy popular entre developers. Es usado en muchísimas plataformas que
manejan texto plano (GitHub, foros, blogs, ...) y es muy común
encontrar varios archivos en ese formato en cualquier tipo de repositorio
(empezando por el tradicional `README.md`).

Estos archivos `Markdown` normalmente contienen _links_ (vínculos/ligas) que
muchas veces están rotos o ya no son válidos y eso perjudica mucho el valor de
la información que se quiere compartir.

Dentro de una comunidad de código abierto, nos han propuesto crear una
herramienta usando [Node.js](https://nodejs.org/), que lea y analice archivos
en formato `Markdown`, para verificar los links que contengan y reportar
algunas estadísticas.

## 2. Resumen del proyecto

Es una herramienta de línea de comandos (CLI) que te permite analizar archivos Markdown y recuperar todos los enlaces presentes en una ruta específica. Ya sea que estés trabajando en un proyecto web, una documentación técnica o simplemente organizando tus archivos Markdown, esta herramienta te ayuda a identificar y verificar rápidamente los enlaces existentes.

Características clave:

- Recupera y muestra una lista detallada de todos los enlaces encontrados en los archivos Markdown.
- Verifica el estado de cada enlace para identificar enlaces rotos o no válidos.
- Soporta carpetas y archivos individuales, lo que te permite analizar todo un proyecto o archivos seleccionados.
- Fácil de usar: simplemente proporciona la ruta de la carpeta o archivo para comenzar el análisis.
- Interfaz de línea de comandos (CLI) para una rápida integración con tus flujos de trabajo existentes.

## 3. Diagrama de flujo

<p align="center">
  <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjfBHBWDsaoOoa5LpNvqIecIzSSP451eUxgUUYTfPue5N9Vh92unDETdvHujX0NM0oKTfKzVn9migbdMONBEDulfGkxPbjvIqDMHcYvOy-ZkDpm7d2wEqJlswYfidyUvG9w1EglkCHy1edDOsJR5MY0VvUENVVmg9ysYw-xcsAdVHUwpRT3vAgqdjKh_g4/w672-h376/Agregar%20un%20subt%C3%ADtulo.png" width="900" height="520">
  https://www.canva.com/design/DAFooaQjzOk/Wn2VxTUl6JONyT7ZiW3zsA/view?utm_content=DAFooaQjzOk&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink
</p>


## 4. Guía de instalación y uso 
#### 1) JavaScript API

Para utilizar la biblioteca como API, siga estos pasos:

+ Clonar este repositorio en tu local 
+ Abra su terminal y use el comando cd para ir a la carpeta     donde desea guardar el proyecto.
+ Ejecute el siguiente comando:
    + `git clone` https://github.com/AnaVargasP/DEV007-md-links.git  
 + Abra la carpeta en su software de edición de código.
 + Abra la terminal y a partir de este punto, puedes comenzar a usar la API
   

### 2) CLI (Command Line Interface - Interfaz de Línea de Comando)
#### Instalación
 + Abre tu terminal y ejecuta el siguiente comando:
   + `npm i md-links-analauvapi`
#### Usabilidad
El ejecutable debe poder usarse de la siguiente
manera a través de la **terminal**:

` md-links-analauvapi <path-to-file> [options]`

#### Unicamente haciendo uso del path ` md-links-analauvapi <path-to-file>`
Se mostrarán todos los enlaces que se encuentran en esa ruta.

* `file`: Ruta del archivo donde se encontró el link.
* `href`: URL encontrada.
* `text`: Texto que aparecía dentro del link (`<a>`).

  ##### Ejemplo
  
```js
PS C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links> md-links-analauvapi file6.md
Routes:
➜ Relative: file6.md
➜ Absolute: C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links\file6.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Found links:
   File: C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links
   Href: https://www.google.com
   Text: Google
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   File: C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links
   Href: https://github.com
   Text: GitHub
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### Si la ruta no es válida o no se encuentra ningún archivo .md, aparecerá un error.

 `An unexpected error occurred The specified path does not exist: path`.

#### Options

##### `--validate`
Se mostrarán todos los enlaces encontrados y comprobará si son válidos o no enviando un mensaje de ok/fail de acuerdo al caso.

* `file`: Ruta del archivo donde se encontró el link.
* `href`: URL encontrada.
* `text`: Texto que aparecía dentro del link (`<a>`).
* `status`: Código de respuesta HTTP.
* `message`: Mensaje `fail` en caso de fallo u `ok` en caso de éxito.

##### Ejemplo
```js
PS C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links> md-links-analauvapi file6.md --validate
Routes:
➜ Relative: file6.md
➜ Absolute: C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links\file6.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Validated links:
   File:  C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links
   Href:  https://www.google.com
   Text:  Google
   Status:  200
   Message:  OK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   File:  C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links
   Text:  GitHub
   Status:  200
   Message:  OK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   File:  C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links
   Href:  https://giub.com
   Text:  GitHub
   Status:  404
   Message:  FAIL ✘
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

##### `--stats`
Se mostrará un mensaje con el total de enlaces encontrados y cuantos de ellos son únicos.

* `total`: 3
* `unique`: 3

##### Ejemplo
```js
PS C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links> md-links-analauvapi file6.md --stats
Routes:
➜ Relative: file6.md
➜ Absolute: C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links\file6.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
File statistics:
   Total:  5
   Unique:  4
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

##### `--stats --validate`
Se mostrará un mensaje diciendo la cantidad total de enlaces encontrados, cuántos de ellos son únicos y cuántos están rotos.

* `total`: 3
* `unique`: 3
* `working`: 2
* `broken`: 1

##### Ejemplo
```js
PS C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links> md-links-analauvapi file6.md --stats --validate
Routes:
➜ Relative: file6.md
➜ Absolute: C:\Users\AnaLaura\OneDrive\Escritorio\DEV007-md-links\file6.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Statistics and Validated links:
   Total:  5
   Unique:  4
   Valid:  4
   Broken:  1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```



