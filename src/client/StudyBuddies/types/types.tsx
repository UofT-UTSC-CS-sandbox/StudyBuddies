// Types.ts

export type Student = {
    name: string;
    img: string | null;
    isStudying: boolean;
    course: string | null;
  };
  
  export type Room = {
    id: number;
    roomNumber: number;
    building: string;
    capacity: number;
    occupancy: number;
    students: Student[];
  };
  
  export type Building = {
    name: string;
    rooms: Room[];
  };
  