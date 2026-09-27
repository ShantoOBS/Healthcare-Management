import MyProfileClient from "@/components/modules/Profile/MyProfileClient";
import { getUserInfo } from "@/services/auth.services";

const MyProfilePage = async () => {
  const userInfo = await getUserInfo();

  return <MyProfileClient userInfo={userInfo} />;
};

export default MyProfilePage;