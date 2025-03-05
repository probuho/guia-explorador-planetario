Entiendo el contexto y veo algunas inconsistencias que deberíamos aclarar antes de proceder con el frontend. Me gustaría hacer algunas 
preguntas importantes:

¿El proyecto será finalmente una aplicación móvil nativa o una aplicación web responsive? Esto 
es crucial para definir la tecnología base del frontend.

seria finalmente una aplicacion web responsive

Sobre la funcionalidad de identificación de especies:

En el Sprint 1 se menciona "Integrar la detección de imágenes para identificación rápida de especies"
Luego mencionas que "la idea de la foto fue descartada" ¿Podrías aclarar cuál es el alcance actual respecto 
a esta funcionalidad?

la idea de la foto fue descartada, pero se mantiene la idea de la identificacion de especies, se podria hacer 
mediante un formulario que estara integrado en la aplicacion web que sera el modulo de foro/wiki ahi vamos a 
incorporar el forulario para que los usuarios puedan ingresar los datos de la especie que quieren identificar
 y se les mostrara una lista de especies que coincidan con los datos ingresados por el usuario y el usuario 
 podra seleccionar la especie que mas se parezca a la que el quiere identificar. 

Respecto al sistema de gamificación y recompensas:

¿Se mantiene la idea del foro/wiki con sistema de recompensas? 

si, se mantiene la idea del foro/wiki con sistema de recompensas

¿Cómo se integraría esto con la idea original del "Explorador Planetario"?
Sobre la arquitectura técnica:

la idea es que el foro/wiki sea el modulo principal de la aplicacion web y que el modulo de identificacion de
    especies sea un modulo secundario que se pueda acceder desde el modulo principal, el modulo de identificacion
    de especies se podria acceder desde el modulo principal mediante un boton que diga identificar especie, 
    al hacer click en ese boton se redirigira al usuario al modulo de identificacion de especies. adicionalmente
    se podria agregar un boton en el modulo de identificacion de especies que diga foro/wiki y al hacer click en
    ese boton se redirigira al usuario al modulo principal. el punto es que los dos modulos esten conectados entre
    si y que se pueda acceder de uno al otro facilmente. si el usuario esta autenticado. otro detalles importante es que 
    la idea original tiene un requerimiento que es se pueda brindar con ayuda de un sistema RA y de IA
    la identificacion de especies, esto se podria hacer en un futuro, pero por ahora se va a hacer mediante un formulario
    pero ahora va a ser sustituida por esta idea que te comente en el contexto de este proyecto. no se si eso responde a tu preguntas

¿Se mantiene la decisión de usar TypeScript y React? si, se mantiene la decision de usar TypeScript y React
¿Se utilizará MongoDB como base de datos principal? si, se utilizara MongoDB como base de datos principal y
 para el backend se utilizara Node.js adicionalmente en la propuesta de la integracion del foro/wiki con sistema de recompensas
 se utilizara otra base de datos que si mal no recuerdo se llama postgresql pero eso aun esta en discusion.

 Para comenzar con el frontend, propongo crear primero una landing page básica que podamos ir evolucionando 
 según las respuestas a estas preguntas. ¿Te parece bien este enfoque?
  
 si me parece excelente 

¿Podrías proporcionarme esta información para asegurar que desarrollemos una solución coherente con 
los objetivos actuales del proyecto?