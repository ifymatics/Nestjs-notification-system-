import { IsString, IsNotEmpty, IsObject, IsOptional } from "class-validator"
class Nofifications {
    //{ "subject": "happy birthday", "content": "We wish you a happy birthday" }
    subject?: string;
    content: string
}
export class SendNotifications {

    @IsString() @IsNotEmpty()
    notificationType: string;

    @IsOptional() @IsString()
    userId: string;

    @IsOptional() @IsString()
    companyId: string;

    @IsOptional() @IsObject()
    notification?: Nofifications
}