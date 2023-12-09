import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  Upload,
} from 'antd'
import ImgCrop from 'antd-img-crop'
import { useEffect, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import {
  getDistrict,
  getWard,
  selectCities,
  selectDistricts,
  selectWards,
} from 'features/slice/location/locationSlice'
import { useDispatch } from 'react-redux'
import { Option } from 'antd/es/mentions'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

const UpdateMember = ({
  isModalOpenUpdate,
  closeModalUpdate,
  selectedMember,
  onFinishUpdate,
  memberById,
}) => {
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()

  const dispatch = useDispatch()
  // --Location
  const cities = useSelector(selectCities)
  const districts = useSelector(selectDistricts)
  const wards = useSelector(selectWards)

  const [selectedCityCode, setSelectedCityCode] = useState(null)
  const [selectedDistrictCode, setSelectedDistrictCode] = useState(null)
  const [selectedWardCode, setSelectedWardCode] = useState(null)

  const [selectedCityName, setSelectedCityName] = useState('')
  const [selectedDistrictName, setSelectedDistrictName] = useState('')
  const [selectedWardName, setSelectedWardName] = useState('')

  useEffect(() => {
    if (memberById?.avatar) {
      setFileList([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: memberById?.avatar,
        },
      ])
    }
  }, [memberById])

  const onFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  useEffect(() => {
    if (selectedMember) {
      // Phân tích địa chỉ
      const addressParts = selectedMember.address.split(', ')

      const selectedCityName = addressParts[2]
      const selectedDistrictName = addressParts[1]
      const selectedWardName = addressParts[0]

      // Tìm kiếm và so sánh thành phố, quận/huyện
      const cityMatch = cities.find((city) => city.name === selectedCityName)
      if (cityMatch) {
        setSelectedCityCode(cityMatch.code)
        form.setFieldsValue({ city: cityMatch.code })
        setSelectedCityName(selectedCityName)
        dispatch(getDistrict(cityMatch.code)).then((newDistricts) => {
          const districtMatch = newDistricts.find(
            (district) => district.name === selectedDistrictName
          )

          if (districtMatch) {
            setSelectedDistrictCode(districtMatch.code)
            form.setFieldsValue({ district: districtMatch.code })

            dispatch(getWard(districtMatch.code)).then((newWards) => {
              const wardMatch = newWards.find(
                (ward) => ward.name === selectedWardName
              )
              if (wardMatch) {
                setSelectedWardCode(wardMatch.code)
                form.setFieldsValue({ ward: wardMatch.code })
              }
            })
          }
        })
      }
    }
  }, [selectedMember, cities, dispatch, form])

  const onFinish = (values) => {
    const address = `${selectedWardName}, ${selectedDistrictName}, ${selectedCityName}`
    const finalValues = {
      ...values,
      // gender: values.gender === 'Male' ? false : true,
      id: selectedMember.id,
      imageFile: fileList[0].originFileObj,
      address: address,
      // farmId: farmId,
    }
    onFinishUpdate(finalValues)
    closeModalUpdate()
    form.resetFields()
  }

  const disabledDate = (current) => {
    return current && current > dayjs().endOf('day')
  }

  const handleCityChange = async (value, option) => {
    setSelectedCityName(option.children)
    setSelectedCityCode(value)

    form.resetFields(['district', 'ward'])
    await dispatch(getDistrict(value))
  }

  const handleDistrictChange = async (value, option) => {
    setSelectedDistrictName(option.children)
    setSelectedDistrictCode(value)
    form.resetFields(['ward'])
    await dispatch(getWard(value))
  }

  const handleWardChange = (value, option) => {
    setSelectedWardName(option.children)
    form.setFieldsValue({ ward: option.children })
  }

  return (
    <>
      <Modal
        title="Cập nhật thông tin nhân viên"
        open={isModalOpenUpdate}
        closeIcon
        onCancel={closeModalUpdate}
        footer={[
          <Button
            form="updateMember"
            type="primary"
            htmlType="reset"
            danger
            onClick={closeModalUpdate}
          >
            Huỷ
          </Button>,
          <Button form="updateMember" type="primary" htmlType="submit">
            Cập nhật
          </Button>,
        ]}
      >
        <Form
          layout="vertical"
          className="first-step-animal"
          id="updateMember"
          onFinish={onFinish}
        >
          <div className="form-left">
            <Form.Item
              label="Tên nhân viên"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên nhân viên',
                },
              ]}
              name="name"
              initialValue={selectedMember ? selectedMember.name : ''}
            >
              <Input placeholder="Nhập tên nhân viên" />
            </Form.Item>

            <Form.Item
              label="Ngày sinh"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn ngày sinh',
                },
              ]}
              name="dateOfBirth"
              // initialValue={
              //   selectedData && selectedData.dateOfBirth
              //     ? dayjs(selectedData.dateOfBirth).format('YYYY-MM-DD')
              //     : null
              // }
            >
              <DatePicker
                format="YYYY-MM-DD"
                disabledDate={disabledDate}
                placeholder="Chọn ngày sinh"
                style={{
                  width: '100%',
                }}
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại nhân viên',
                },
                () => ({
                  validator(_, value) {
                    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})\b/
                    if (!value || phoneRegex.test(value)) {
                      return Promise.resolve()
                    }
                    return Promise.reject(
                      new Error('Số điện thoại không hợp lệ')
                    )
                  },
                }),
              ]}
              initialValue={selectedMember ? selectedMember.phoneNumber : ''}
              name="phoneNumber"
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              rules={[
                {
                  type: 'email',
                  message: 'Không phải email!!',
                },
                {
                  required: true,
                  message: 'Vui lòng nhập vào email',
                },
              ]}
              initialValue={selectedMember ? selectedMember.email : ''}
              name="email"
            >
              <Input placeholder="Nhập Email" />
            </Form.Item>

            <Form.Item
              name="city"
              label="Tỉnh/Thành phố"
              initialValue={selectedCityCode}
            >
              <Select
                placeholder="Chọn Tỉnh/Thành phố"
                onChange={handleCityChange}
                allowClear
              >
                {cities.map((city) => (
                  <Option key={city.code} value={city.code}>
                    {city.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Quận/Huyện/Thị xã"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn Quận/Huyện/Thị xã',
                },
              ]}
              name="district"
              initialValue={selectedDistrictCode}
            >
              <Select
                placeholder="Chọn Quận/Huyện/Thị xã"
                allowClear
                onChange={handleDistrictChange}
              >
                {districts.map((district) => (
                  <Option key={district.code} value={district.code}>
                    {district.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Phường/Xã"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn Phường/Xã/Thị trấn',
                },
              ]}
              name="ward"
              initialValue={selectedWardCode}
            >
              <Select
                placeholder="Chọn Phường/Xã/Thị trấn"
                onChange={handleWardChange}
                allowClear
              >
                {wards.map((ward) => (
                  <Option key={ward.code} value={ward.code}>
                    {ward.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="form-right">
            <Form.Item
              label="Mã nhân viên"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mã nhân viên',
                },
              ]}
              name="code"
              initialValue={selectedMember ? selectedMember.code : ''}
            >
              <Input placeholder="Nhập mã khu vực" />
            </Form.Item>

            {/* Mã */}
            {/* <Form.Item
              label="Tên người dùng"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên người dùng',
                },
              ]}
              name="userName"
              initialValue={selectedMember ? selectedMember.userName : ''}
            >
              <Input placeholder="Nhập tên người dùng" />
            </Form.Item> */}

            {/* Mã */}
            {/* <Form.Item
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập mật khẩu',
                },
              ]}
              name="password"
              initialValue={selectedMember ? selectedMember.password : ''}
            >
              <Input.Password
                placeholder="Nhập mật khẩu"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item> */}

            <Form.Item label="Hình đại diện" name="avatar">
              <ImgCrop rotationSlider>
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={onFileChange}
                >
                  <UploadOutlined />
                </Upload>
              </ImgCrop>
            </Form.Item>

            {/* <Form.Item
              label="Chức vụ"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn chức vụ',
                },
              ]}
              name="roleId"
              initialValue={selectedMember ? selectedMember.roleName : ''}
            >
              <Radio.Group>
                <Radio value="Manager">Ngưởi quản lý</Radio>
                <Radio value="Supervisor">Ngưởi giám sát</Radio>
              </Radio.Group>
            </Form.Item> */}
          </div>
        </Form>
      </Modal>
    </>
  )
}
export default UpdateMember
