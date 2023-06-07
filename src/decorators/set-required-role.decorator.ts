import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/types/user-role";

export const SetRequiredRole = (requiredRole: UserRole) => SetMetadata('role', requiredRole);