export interface IEmployee {
  employee_id: Number;
  employee_name: String;
  employee_image: String;
  gender: 'Male' | 'Female';
  position: 'employee' | 'admin';
  salary: Number;
}
