export class User {
    constructor(
		public name: string,
		public lastname: string,
		public email: string,
		public id?: string,
        public absences?: Absence[],
	) {}
}

export class Absence {
    constructor(
		public absenceId: string,
		public employeeId: string,
		public comment: string,
		public dateStart: Date,
		public dateEnd: Date,
		public id?: string,
	) {}
}

export class AbsenceDefinition {
    constructor(
		public name: string,
		public id: string
	) {}
}