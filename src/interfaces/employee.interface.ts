export interface IEmployee {
  employee_id: Number;
  employee_name: string;
  employee_image: string;
  gender: 'Male' | 'Female';
  position: 'employee' | 'admin';
  salary: Number;
}
