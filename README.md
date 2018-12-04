# va_proyecto
Proyecto final de Visual Analytics UniAndes 2018

CLIENTE : ALEJANDRO REYES

PROFESOR : JOHN A. GUERRA.

ESTUDIANTES:
-ANGELA SOFÍA GARCÍA VEGA, AS.GARCIAV@UNIANDES.EDU.CO  
-CARLOS MORENO IBARGÜEN.      C.MORENO@UNIANDES.EDU.CO

## Contexto:
 
Para comprender la información descrita en la visualización se requiere de un conocimiento mínimo sobre salud y las variables que pueden influir sobre la misma. El proyecto busca desarrollar investigación básica en el área de la salud de variables de salud, nutrición y microbiota intestinal. Estudios previos en diferentes poblaciones alrededor del mundo describen que la microbiota intestinal cambia en relación a los diferentes estados de salud del individuo [1], algunos estudios sugieren que la microbiota intestinal cambia con la dieta [2]. Teniendo en cuenta que modificar la dieta es una de las metodologías destacadas para mejorar la salud de las personas en general es importante identificar la relación entre la dieta, la microbiota intestinal y la salud.
 
## Público objetivo:
 
Para el usuario general la visualización es capaz de describir variables sociodemográficas de la muestra de la población colombiana, una descripción de la dieta colombiana, mostrar algunas tendencias en el consumo de los principales macronutrientes de la dieta e ilustrar los principales grupos taxonómicos de bacterias encontrados en la microbiota intestinal de los individuos.
 
Para el usuario con conocimientos previos en áreas de ciencias biológicas y de la salud, la visualización permite describir tendencias conjuntas en el análisis de los macronutrientes de la dieta, el estado nutricional a lo largo de las diferentes características sociodemográficas y muestra claramente cambios en diferentes taxones de interés en salud reconocibles en reportes de la literatura.
 
### What?
Se tiene información en forma de tabla para 441 personas, cada una con su correspondiente información de dieta, salud y microbiota intestinal, de los datos aquellos de mayor dificultad son los de microbiota intestinal ya que es un dataset en forma de matriz donde se describe la totalidad de OTUs (Operationa Taxonomic Units) que son elementos artificiales que idealmente representan una especie de bacteria, cada OTU tiene asignada una taxonomía que permite generar una descripción jerárquica de los datos. No se tienen datos geoespaciales o de series de tiempo.
 
Tipos de datos:

-Categóricos (ciudad, sexo, clasificación del estado nutricional, clasificación estado de salud)

-Ordinales - Cuantitativo secuencial (todas las variables de dieta, variables socio-demográficas: edad, estrato y todas las variables de salud)

-Cualitativo - ordinal - secuencial (clasificación del estado nutricional)
 
### Why?
 
Tarea principal No 1: Explorar la información descrita por los diferentes aspectos recopilados (variables o atributos) disponibles en una muestra de la población colombiana.
            Explore, features:     Dada la gran cantidad de información y de variables disponibles se             pretende observar el comportamiento de los atributos a medida que se    navega por la información, de forma independiente y en conjunto.                     

Summarize, All Data: Crear una síntesis de los datos respecto a uno de los atributos: salud, dieta o microbiota.
A. Categorizar la relación entre los atributos (posibilidad de crear clusters de datos)
            Derive, Features:      Crear agrupaciones basadas en los datos de abundancia de microbiota             intestinal, agrupaciones basadas en los datos          
B. Discriminar los datos por las diferentes variables sociodemográficas
            Compare,       similarity-features:   Comparar los datos de las temáticas principales de acuerdo a los       atributos de grupo de edad, sexo y ciudad  
C. Buscar los factores que afectan la salud
            Locate, Features:     Buscar los factores relacionados con el atributo de salud   cardiovascular
D. Disfrutar de navegar a través de las diferentes gráficas de la visualización
            Enjoy:             Que la información encontrada sea agradable a la vista
 
 
Tarea principal No.2: Identificar patrones entre los temas de microbiota intestinal, dieta y salud en una muestra de la población colombiana. 
Identify, trends: Identificar al menos un atributo para cada uno de los temas centrales del problema que se relacione entre sí.

Tareas secundarias de la tarea principal No.1:
A. Identificar dependencias entre los diferentes temas
            Discover,       dependency: Encontrar        dependencias entre las variables
B. Clasificación de los datos en términos de saludable o no saludable
            Derive, Features:      Crear clusters de datos que fuertemente agrupables entre sí
C. Encontrar datos extremos
            Identify, outliers:      Identificar individuos con
 
 
### How?
 
IDIOM1 – Multiple filtered graphics
- Tablas
- Gráficos de barras
- Multiple Line chart
- Heatmap con small multiples
 
IDIOM2 – Dendograma horizontal
Marcas: Puntos para los nodos y Lineas para las conecciones jerárquicas basadas en taxonomía
Canales: tree layout, basado en las diferentes categorias taxonómicas (filum, orden, clase, familia, genero, especie)
Encode: Separate, order, align,
Reduce: Filter (from previous IDIOM) y Aggregate por el nombre del taxón en la taxonomía
 
## Insights:
- Se tienen un número homogéneo de personas a lo largo de las diferentes ciudades, sexo y estado nutricional
- Dos terceras partes de la población estudiada tiene sobrepeso u obesidad
- Hay una tendencia de asociación entre el consumo de grasa y proteína, que es inversamente proporcional al consumo de carbohidrato. Hay algunos datos extremos que tienen un muy alto consumo de proteina con un bajo consumo de grasa y visceversa. Lo que indica que la dieta puede ser variable entre cada individuo
- Revisando el heatmap las OTUs presentes en la mayor parte de los individuos de todas las ciudades se encuentran entre las primeras 36 OTUs las cuales se pueden considerar como descriptoras genéricas de toda la problación colombiana hay algunas OTUs que se encuentran en mayor proporción en alguna de las diferentes ciudades, dichas OTUs son de interés para revisarlas en detalle posteriormente
- De acuerdo con lo reportado por cada individuo la calidad de la dieta en las diferentes ciudades es buena, lo cual es interesante teniendo en cuenta que dos terceras partes de la población en cada ciudad tienen sobrepeso y obesidad (Generan preguntas como ¿La persona reportó en realidad su consumo usual? ¿La población estudiada conoce lo que es una dieta saludable? De ser así es posible un sesgo en éste dato).
- Todas las familias taxonómicas descritas se encuentran destribuidas de forma similar a lo largo de los diferentes estados de salud, a lo largo de las diferentes ciudades y del sexo de las personas, su variación es dependiente de la abundancia a pesar de que las diferencias entre las diferentes variables es pequeña.
- Entre las diferentes ciudades la abundancia relativa de los diferentes taxa se asemejan entre Bogotá, Medellín y Barranquilla, observando diferencias marcadas con Bucaramanga o Cali donde se observa una mayor cantidad de Bacteroidetes y una disminución en la cantidad de Actinobacterias
- Al comparar las abundancias de las diferentes familias de bacterias no se observan diferencias marcadas entre los diferentes estados nutricionales de la cohorte estudiada
- Si se observan diferencias en las abundancias de ciertos grupos taxonómicos por ejemplo en aquellos individuos con un estado nutricional normal hay mayor abundancia relativa de Verrucomicrobia un taxón que se caracteriza por describir bacterias ambientales.

## External Links
Slides: https://docs.google.com/presentation/d/1_FYl-cn3iF9RZo5NQ_I2rFDqR6m7GlxDXIILzBvmjjc/edit?usp=sharing
Demo: https://cuntaquinte.github.io/va_proyecto/index.html
 
