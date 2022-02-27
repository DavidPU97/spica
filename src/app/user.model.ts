export class User {
    constructor(
		public name: string,
		public lastname: string,
		public email: string,
        public absences?: Absences
	) {}
}

export class Absences {
    constructor(
		
	) {}
}
