import { useEffect, useState } from "react";
import { useTranslate, useApiUrl } from "@refinedev/core";
import { Create, getValueFromEvent, useSelect } from "@refinedev/antd";
import { add } from "../../../../service/product.service";
import {
  readAllColor,
  readAllChip,
  readAllBattery,
  readAllCapacity,
  readAllCategory,
  readAllManufacture,
  readAllRam,
  readAllScreen,
  readAllSize,
} from "../../../../service/product.service";
// import queryString from "query-string";

import {
  Drawer,
  DrawerProps,
  Form,
  FormProps,
  Input,
  InputNumber,
  Radio,
  Select,
  Space,
  ButtonProps,
  Avatar,
  Typography,
  Upload,
  Grid,
} from "antd";
import {
  Link,
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { Option } from "antd/es/mentions";
import { display } from "@mui/system";
import { Hidden } from "@mui/material";

const Test = () => {
  const { Text } = Typography;
  const history = useHistory();
  const t = useTranslate();
  const apiUrl = useApiUrl();

  const [productData, setProductData] = useState({});

  const handleInputChangeCategory = (value) => {
    setProductData({
      ...productData,
      category: value,
    });
  };
  const handleInputChangeBattery = (value) => {
    setProductData({
      ...productData,
      battery: value,
    });
  };

  const handleInputChangeCapacity = (value) => {
    setProductData({
      ...productData,
      capacity: value,
    });
  };
  const handleInputChangeChip = (value) => {
    setProductData({
      ...productData,
      chip: value,
    });
  };
  const handleInputChangeColor = (value) => {
    setProductData({
      ...productData,
      color: value,
    });
  };
  const handleInputChangeManufacturer = (value) => {
    setProductData({
      ...productData,
      manufacturer: value,
    });
  };
  const handleInputChangeRam = (value) => {
    setProductData({
      ...productData,
      ram: value,
      // screen: value,
      // screen: value,
    });
  };
  const handleInputChangeScreen = (value) => {
    setProductData({
      ...productData,
      screen: value,
    });
  };
  const handleInputChangeSize = (value) => {
    setProductData({
      ...productData,
      size: value,
    });
  };

  // const [priceValue, setPriceValue] = useState();
  // Hàm xử lý sự kiện khi giá trị thay đổi
  const handleNumberChangePrice = (value) => {
    // Giá trị mới sẽ được truyền vào hàm này
    // Cập nhật giá trị trong state

    setProductData({
      ...productData,
      price: value,
    });
  };

  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...productData, price: 0 };
    item[name] = value;
    setProductData(item);
  }
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị Modal

  // Hàm để hiển thị Modal khi cần
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm để ẩn Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const items = { ...productData };

    // Đây là nơi bạn có thể gửi dữ liệu sản phẩm (productData) lên máy chủ hoặc thực hiện bất kỳ xử lý nào bạn cần.
    console.log("Dữ liệu sản phẩm:", items);
    add(items);
    history.push("/product/display");
  }

  const [displayColor, setDisplayColor] = useState([]);
  const [displayChip, setDisplayChip] = useState([]);
  const [displayBattery, setDisplayBattery] = useState([]);
  const [displayCapacity, setDisplayCapacity] = useState([]);
  const [displayCategory, setDisplayCategory] = useState([]);
  const [displayManufacture, setDisplayManufacture] = useState([]);
  const [displayRam, setDisplayRam] = useState([]);
  const [displayScreen, setDisplayScreen] = useState([]);
  const [displaySize, setDisplaySize] = useState([]);

  useEffect(() => {
    //1
    readAllColor()
      .then((response) => {
        console.log(response.data);
        setDisplayColor(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //2
    readAllChip()
      .then((response) => {
        console.log(response.data);
        setDisplayChip(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //3
    readAllBattery()
      .then((response) => {
        console.log(response.data);
        setDisplayBattery(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //4
    readAllCapacity()
      .then((response) => {
        console.log(response.data);
        setDisplayCapacity(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //5
    readAllCategory()
      .then((response) => {
        console.log(response.data);
        setDisplayCategory(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //6
    readAllManufacture()
      .then((response) => {
        console.log(response.data);
        setDisplayManufacture(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //7
    readAllRam()
      .then((response) => {
        console.log(response.data);
        setDisplayRam(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //8
    readAllScreen()
      .then((response) => {
        console.log(response.data);
        setDisplayScreen(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //9
    readAllSize()
      .then((response) => {
        console.log(response.data);
        setDisplaySize(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
  }, []);

  const test = () => {
    const ok = document.getElementById("test");
    ok.setAttribute("hidden", true);
  };

  return (
    // <Drawer
    //   //   {...drawerProps}
    //   //   width={breakpoint.sm ? "500px" : "100%"}
    //   zIndex={1001}
    // >

    <form onSubmit={handleSubmit}>
      <Create
        resource="products"
        // saveButtonProps={saveButtonProps}

        goBack={false}
        contentProps={{
          style: {
            boxShadow: "none",
          },
          bodyStyle: {
            padding: 0,
          },
        }}
        // saveButtonProps={(onclick = test)}
      >
        <Form
          //   {...formProps}
          layout="vertical"
          initialValues={{
            isActive: true,
          }}
          // id="test"
        >
          <Form.Item
            // label={t("products.fields.images.label")}
            label={t("Images")}
          >
            <Form.Item
              name="images"
              valuePropName="fileList"
              getValueFromEvent={getValueFromEvent}
              noStyle
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Upload.Dragger
                name="file"
                action={`${apiUrl}/image/save`}
                listType="picture"
                maxCount={1}
                accept=".png"
              >
                <Space direction="vertical" size={2}>
                  <Avatar
                    style={{
                      width: "100%",
                      height: "100%",
                      maxWidth: "256px",
                    }}
                    src="https://example.admin.refine.dev/images/product-default-img.png"
                    alt="Store Location"
                  />
                  <Text
                    style={{
                      fontWeight: 800,
                      fontSize: "16px",
                      marginTop: "8px",
                    }}
                  >
                    {/* {t("products.fields.images.description")} */}
                    Add product description
                  </Text>
                  <Text style={{ fontSize: "12px" }}>
                    {/* {t("products.fields.images.validation")} */}
                    must be 1080x1080 px
                  </Text>
                </Space>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
          <Form.Item
            // label={t("products.fields.name")}
            label={t("Name")}
            name="nameProduct"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              type="text"
              required
              value={productData.nameProduct || ""}
              onChange={handleChange}
              id="nameProduct"
              name="nameProduct"
            ></Input>
          </Form.Item>
          <Form.Item
            // label={t("products.fields.description")}
            label={t("Description")}
            name="description"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea
              rows={6}
              type="text"
              required
              value={productData.description || ""}
              onChange={handleChange}
              id="description"
              name="description"
            />
          </Form.Item>
          <Form.Item
            // label={t("products.fields.price")}
            label={t("Price")}
            name="price"
            rules={[
              {
                required: true,
                type: "number",
              },
            ]}
          >
            <InputNumber
              //   formatter={(value) => `$ ${value}`}
              style={{ width: "150px" }}
              min={0}
              type="number"
              required
              name="price"
              value={productData.price}
              onChange={handleNumberChangePrice}
              // id="price"
            />
          </Form.Item>
          <Form.Item
            // label={t("products.fields.category")}
            label={t("Category")}
            name={["category", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "left",
              clear: "both",
            }}
          >
            {/* <Select
          //   {...categorySelectProps}
          /> */}
            <Select
              name="category"
              value={productData.category}
              onChange={handleInputChangeCategory}
            >
              {displayCategory.map((categories) => {
                return (
                  <Option value={categories.name}>{categories.name}</Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Capacity")}
            name={["capacity", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "right",
            }}
          >
            <Select
              name="capacity"
              value={productData.capacity}
              onChange={handleInputChangeCapacity}
            >
              {displayCapacity.map((capacity) => {
                return <Option value={capacity.name}>{capacity.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Battery")}
            name={["battery", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "left",
              clear: "both",
            }}
          >
            <Select
              name="battery"
              value={productData.battery}
              onChange={handleInputChangeBattery}
            >
              {displayBattery.map((battery) => {
                return <Option value={battery.name}>{battery.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Chip")}
            name={["chip", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "right",
            }}
          >
            <Select
              name="chip"
              value={productData.chip}
              onChange={handleInputChangeChip}
            >
              {displayChip.map((chip) => {
                return <Option value={chip.name}>{chip.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Color")}
            name={["color", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "left",
              clear: "both",
            }}
          >
            <Select
              name="color"
              value={productData.color}
              onChange={handleInputChangeColor}
            >
              {displayColor.map((color) => {
                return <Option value={color.name}>{color.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Image")}
            name={["image", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "right",
            }}
          >
            <Select>
              <Option>123</Option>
              <Option>123</Option>
              <Option>123</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Manufacture")}
            name={["manufacture", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "left",
              clear: "both",
            }}
          >
            <Select
              name="manufacture"
              value={productData.manufacture}
              onChange={handleInputChangeManufacturer}
            >
              {displayManufacture.map((manufacture) => {
                return (
                  <Option value={manufacture.name}>{manufacture.name}</Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Ram")}
            name={["ram", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "right",
            }}
          >
            <Select
              name="ram"
              value={productData.ram}
              onChange={handleInputChangeRam}
            >
              {displayRam.map((ram) => {
                return <Option value={ram.name}>{ram.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Screen")}
            name={["screen", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "left",
              clear: "both",
            }}
          >
            <Select
              name="screen"
              value={productData.screen}
              onChange={handleInputChangeScreen}
            >
              {displayScreen.map((screen) => {
                return <Option value={screen.name}>{screen.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label={t("Size")}
            name={["size", "id"]}
            rules={[
              {
                required: true,
              },
            ]}
            style={{
              width: "49%",
              float: "right",
            }}
          >
            <Select
              name="size"
              value={productData.size}
              onChange={handleInputChangeSize}
            >
              {displaySize.map((size) => {
                return <Option value={size.name}>{size.name}</Option>;
              })}
            </Select>
          </Form.Item>
          <Form.Item
            //   label={t("products.fields.isActive")}
            label={t("Active")}
            name="isActive"
            style={{
              clear: "both",
            }}
          >
            <Radio.Group>
              <Radio value={true}>{/* {t("status.enable")} */}Enable</Radio>
              <Radio value={false}>{/* {t("status.disable")} */}Disable</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Create>
    </form>

    // </Drawer>
  );
};
export default Test;