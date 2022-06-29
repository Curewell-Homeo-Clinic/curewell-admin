import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <UserProfile hideNavigation path="/user" routing="path" />
);

export default UserProfilePage;
