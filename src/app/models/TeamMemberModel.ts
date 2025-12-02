export interface TeamMemberModel {
	_id?: string;
	brokerId: string;
	firstName: string;
	lastName?: string;
	designation: string;
	emailAddress: string;
	phoneNumber: string;
	profileImage: string;
	siteUrl?: string;
	about?: string;
	address?: string;
	socialLinks: {
		facebook: string;
		twitter: string;
		instagram: string;
		linkedin: string;
		youtube: string;
	};
	createdAt: Date;
	updatedAt: Date;
}
