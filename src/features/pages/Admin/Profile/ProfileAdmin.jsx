import { Avatar } from "antd";
import { getMemberById, updateMember } from "features/slice/user/memberSlice";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { authServices } from "services/authServices";
import ViewProfile from "./ViewProfile";
import dayjs from "dayjs";
import EditProfileAdmin from "./EditProfileAdmin";

const ProfileAdmin = () => {
  const [isModalEditVisible, setIsModalEditVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);

  const [selectedCityName, setSelectedCityName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");

  const dispatch = useDispatch();

  const member = useSelector((state) => state.member.data);

  useEffect(() => {
    dispatch(getMemberById(authServices.getUserId()));
  }, [dispatch]);

  useEffect(() => {
    if (member?.avatar) {
      setFileList([
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: member ? member.avatar : null,
        },
      ]);
    }
  }, [member]);

  const onFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const formattedBirthDay = member
    ? dayjs(member.birthday).format("DD-MM-YYYY")
    : null;

  const handleOpenEditProfile = () => {
    setIsModalEditVisible(true);
  };

  const closeEditProfile = () => {
    setIsModalEditVisible(false);
  };

  const handleEditProfile = (values) => {
    setIsSubmitting(true);
    // const address = `${selectedWardName}, ${selectedDistrictName}, ${selectedCityName}`
    const editProfile = {
      ...values,
      code: member.code,
      imageFile: fileList[0].originFileObj,
      address: member.address,
      birthday: member.birthday,
    };
    dispatch(updateMember({ id: member.id, body: editProfile })).then(() => {
      dispatch(getMemberById(authServices.getUserId()));
      setIsModalEditVisible(false);
      setIsSubmitting(false);
    });
  };

  return (
    <>
      <ViewProfile
        member={member}
        handleOpenEditProfile={handleOpenEditProfile}
        formattedBirthDay={formattedBirthDay}
      />
      <EditProfileAdmin
        isModalEditVisible={isModalEditVisible}
        closeEditProfile={closeEditProfile}
        handleEditProfile={handleEditProfile}
        fileList={fileList}
        onFileChange={onFileChange}
        member={member}
        isSubmitting={isSubmitting}
        setSelectedCityName={setSelectedCityName}
        setSelectedDistrictName={setSelectedDistrictName}
        setSelectedWardName={setSelectedWardName}
      />
    </>
  );
};

export default ProfileAdmin;
