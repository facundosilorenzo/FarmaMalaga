/*
 * Datos del negocio. Todo lo que cambia (teléfonos, horarios, enlaces) se edita aquí.
 * Los horarios vienen de la web antigua (2020): confírmalos antes de publicar.
 *
 * Horario: un array por día, empezando en LUNES (0) y terminando en DOMINGO (6).
 * Cada día es una lista de tramos ["HH:MM", "HH:MM"]. Lista vacía = cerrado.
 */
window.FARMA_CONFIG = {
  tienda: "tienda.html",
  tiendaActual: "https://farmamalaga.com/",
  buscarEnTienda: "tienda.html?q=",
  whatsapp: "34630282123",
  whatsappTexto: "Hola, tengo una consulta para el farmacéutico: ",
  email: "info@farmamalaga.com",
  redes: {
    instagram: "https://www.instagram.com/farmacia_mata/",
    facebook: "https://www.facebook.com/farmamalaga/"
  },

  // Fechas (mes-día) entre las que se aplica el horario de verano, si una farmacia lo tiene.
  verano: { desde: "06-15", hasta: "09-15" },

  farmacias: {
    mata: {
      nombre: "Farmacia Mata",
      telefono: "+34952211915",
      mapa: "https://www.google.com/maps/search/?api=1&query=Farmacia+Mata+Calle+Marqu%C3%A9s+de+Larios+8+M%C3%A1laga",
      horario: [
        [["09:00", "22:00"]],
        [["09:00", "22:00"]],
        [["09:00", "22:00"]],
        [["09:00", "22:00"]],
        [["09:00", "22:00"]],
        [["09:00", "22:00"]],
        []
      ]
    },
    garcia: {
      nombre: "Farmacia García Carmona",
      telefono: "+34952391549",
      mapa: "https://www.google.com/maps/search/?api=1&query=Farmacia+Calle+Hu%C3%A9scar+2+M%C3%A1laga",
      horario: [
        [["09:30", "14:00"], ["16:30", "20:00"]],
        [["09:30", "14:00"], ["16:30", "20:00"]],
        [["09:30", "14:00"], ["16:30", "20:00"]],
        [["09:30", "14:00"], ["16:30", "20:00"]],
        [["09:30", "14:00"], ["16:30", "20:00"]],
        [["10:00", "13:30"]],
        []
      ],
      horarioVerano: [
        [["09:30", "14:00"], ["17:00", "20:30"]],
        [["09:30", "14:00"], ["17:00", "20:30"]],
        [["09:30", "14:00"], ["17:00", "20:30"]],
        [["09:30", "14:00"], ["17:00", "20:30"]],
        [["09:30", "14:00"], ["17:00", "20:30"]],
        [["10:00", "13:30"]],
        []
      ]
    },
    romero: {
      nombre: "Farmacia Dr. Antonio Romero García",
      telefono: "+34952575806",
      mapa: "https://www.google.com/maps/search/?api=1&query=Farmacia+Calle+Eros+1+Benalm%C3%A1dena",
      horario: [
        [["09:00", "21:00"]],
        [["09:00", "21:00"]],
        [["09:00", "21:00"]],
        [["09:00", "21:00"]],
        [["09:00", "21:00"]],
        [["09:30", "15:00"]],
        [["10:00", "14:00"]]
      ]
    }
  }
};
