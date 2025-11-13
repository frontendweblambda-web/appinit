export interface ProjectMetadata {
	id: string;
	name: string;
	createdAt: string;
	updatedAt?: string;
	components?: string[];
	scaffoldSource?: string;
}
