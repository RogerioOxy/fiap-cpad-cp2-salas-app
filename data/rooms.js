// Dados simulados de salas da FIAP (seed data)
// Em um app real, esses dados viriam de uma API.
// As reservas criadas pelos usuários são persistidas no AsyncStorage (ver AppDataContext).
//
// Matérias e professores baseados na grade real da Engenharia de Computação - 2º ano:
//   POO              — Prof. Ygor Anjos
//   CPAD             — Prof. Hercules Ramos
//   DSA              — Prof. Roberto Beraldo
//   Edge Computing   — Prof. Marcelo Morgantini
//   OS & Networks    — Prof. Victor Fernandes
//   Design Thinking

const rooms = [
  {
    id: 1,
    name: 'Sala 101',
    floor: 1,
    type: 'Sala de Aula',
    capacity: 40,
    status: 'disponivel',
    currentClass: null,
    nextClass: 'POO - Prof. Ygor - 14:00',
  },
  {
    id: 2,
    name: 'Sala 102',
    floor: 1,
    type: 'Sala de Aula',
    capacity: 40,
    status: 'ocupada',
    currentClass: 'CPAD - Prof. Hercules',
    nextClass: null,
  },
  {
    id: 3,
    name: 'Sala 103',
    floor: 1,
    type: 'Sala de Aula',
    capacity: 35,
    status: 'disponivel',
    currentClass: null,
    nextClass: 'Design Thinking - 15:30',
  },
  {
    id: 4,
    name: 'Lab 201',
    floor: 2,
    type: 'Laboratório',
    capacity: 30,
    status: 'ocupada',
    currentClass: 'Edge Computing - Prof. Morgantini',
    nextClass: null,
  },
  {
    id: 5,
    name: 'Lab 202',
    floor: 2,
    type: 'Laboratório',
    capacity: 30,
    status: 'manutencao',
    currentClass: null,
    nextClass: null,
  },
  {
    id: 6,
    name: 'Lab 203',
    floor: 2,
    type: 'Laboratório',
    capacity: 25,
    status: 'disponivel',
    currentClass: null,
    nextClass: 'OS & Networks - Prof. Victor - 16:00',
  },
  {
    id: 7,
    name: 'Sala 301',
    floor: 3,
    type: 'Sala de Aula',
    capacity: 45,
    status: 'ocupada',
    currentClass: 'DSA - Prof. Roberto',
    nextClass: null,
  },
  {
    id: 8,
    name: 'Sala 302',
    floor: 3,
    type: 'Sala de Aula',
    capacity: 45,
    status: 'disponivel',
    currentClass: null,
    nextClass: 'POO - Prof. Ygor - 17:00',
  },
  {
    id: 9,
    name: 'Auditório',
    floor: 1,
    type: 'Auditório',
    capacity: 200,
    status: 'disponivel',
    currentClass: null,
    nextClass: 'Palestra - 19:00',
  },
  {
    id: 10,
    name: 'Lab 204',
    floor: 2,
    type: 'Laboratório',
    capacity: 28,
    status: 'ocupada',
    currentClass: 'CPAD - Prof. Hercules',
    nextClass: null,
  },
];

// Slots de horário disponíveis para reserva
export const TIME_SLOTS = [
  '08:00 - 09:40',
  '09:50 - 11:30',
  '13:30 - 15:10',
  '15:20 - 17:00',
  '17:10 - 18:50',
  '19:00 - 20:40',
  '20:50 - 22:30',
];

export default rooms;
