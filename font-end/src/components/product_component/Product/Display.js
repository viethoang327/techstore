import React, { useEffect, useState } from "react";
import { readAll } from "../../../service/product.service";
import Pagination from "./PageNext";
import queryString from "query-string";
import {
  Typography,
  Row,
  Col,
  List as AntdList,
  Input,
  Form,
  Modal,
  ModalProps,
  Avatar,
  Card,
  Divider,
  InputNumber,
  Dropdown,
  Menu,
  Button,
} from "antd";
import {
  SearchOutlined,
  CloseCircleOutlined,
  FormOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import { StyledStoreProducts } from "./Interface/index";
import { NumberField } from "@refinedev/antd";
import CreateProduct from "./crud/create";
// import "../css/index.css";
// import Container from "react-bootstrap/Container";
// import Navbar from "react-bootstrap/Navbar";

import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

const { Text, Paragraph } = Typography;
const StoreProducts = ({}) => {
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị Modal

  // Hàm để hiển thị Modal khi cần
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hàm để ẩn Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // const [item, setItem] = useState({
  //   id: 1,
  //   name: "Iphone 11",
  //   description: "Zin đét",
  //   price: 99,
  //   stock: 1,
  // });

  function updateStock() {
    return 1;
  }

  const [display, setDisplay] = useState([]);

  const [pagination, setPagination] = useState({
    page: 0,
    limit: 5,
    totalRows: 1,
  });

  const [filters, setFilters] = useState({
    page: 0,
    key: "",
  });

  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  useEffect(() => {
    const paramsString = queryString.stringify(filters);
    readAll(paramsString)
      .then((response) => {
        console.log(response.data);
        setDisplay(response.data.content);
        setPagination(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
  }, [filters]);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <main>
          {/* <aside>
              <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                  <Navbar.Brand href="#">Navbar</Navbar.Brand>
                </Container>
              </Navbar>
            </aside> */}
          <section>
            <Form
              style={{ marginTop: "24px", marginLeft: "30px" }}
              // {...searchFormProps}
              // form={searchForm}
              // onValuesChange={() => onSearch()}
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={18}>
                  <StyledStoreProducts>
                    <Text style={{ fontSize: "24px" }} strong>
                      {/* {t("stores.storeProducts")} */}
                      PRODUCT
                    </Text>
                    <Form.Item name="name" noStyle>
                      <Input
                        style={{ width: "300px" }}
                        // placeholder={t("stores.productSearch")}
                        suffix={<SearchOutlined />}
                      />
                    </Form.Item>
                    <Button onClick={showModal}>AddProduct</Button>
                  </StyledStoreProducts>
                  {/* <AntdList
                      grid={{
                        gutter: 8,
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 3,
                        xxl: 3,
                      }}
                      style={{
                        height: "100%",
                        maxHeight: "548px",
                        overflow: "auto",
                        paddingRight: "4px",
                      }}
                      {...listProps}
                      dataSource={mergedData as IProduct[]}
                      renderItem={(item) => (
                        <ProductItem
                          item={item}
                          // updateStock={updateStock}
                          // editShow={showEdit}
                        />
                      )} */}
                  {/* /> */}
                </Col>
              </Row>

              <Row>
                {display.map((item) => {
                  return (
                    <Col key={item.id}>
                      <Card
                        style={{
                          margin: "8px",
                          opacity: item.stock <= 0 ? 0.5 : 1,
                        }}
                        bodyStyle={{ height: "500px" }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "10px",
                            right: "5px",
                          }}
                        >
                          <Dropdown
                            overlay={
                              <Menu mode="vertical">
                                {updateStock && (
                                  <Menu.Item
                                    key="1"
                                    disabled={item.stock <= 0}
                                    style={{
                                      fontWeight: 500,
                                    }}
                                    icon={
                                      <CloseCircleOutlined
                                        style={{
                                          color: "red",
                                        }}
                                      />
                                    }
                                    onClick={() => updateStock(0, item)}
                                  >
                                    {/* {t("stores.buttons.outOfStock")} */}
                                  </Menu.Item>
                                )}
                                <Menu.Item
                                  key="2"
                                  style={{
                                    fontWeight: 500,
                                  }}
                                  icon={
                                    <FormOutlined
                                      style={{
                                        color: "green",
                                      }}
                                    />
                                  }
                                  // onClick={() => editShow(item.id)}
                                >
                                  {/* {t("stores.buttons.edit")} */}
                                </Menu.Item>
                              </Menu>
                            }
                            trigger={["click"]}
                          >
                            <MoreOutlined
                              style={{
                                fontSize: 24,
                              }}
                            />
                          </Dropdown>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            height: "100%",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <Avatar
                              size={128}
                              src="https://lh3.googleusercontent.com/a/ACg8ocIBM8sUau1de7i4zCqfSWxOzR6NcEsoischk9lDBTeo=s64-mo"
                            />
                          </div>
                          <Divider />
                          <Paragraph
                            ellipsis={{ rows: 2, tooltip: true }}
                            style={{
                              fontSize: "18px",
                              fontWeight: 800,
                              marginBottom: "8px",
                            }}
                          >
                            {item.name}
                          </Paragraph>
                          <Paragraph
                            ellipsis={{ rows: 3, tooltip: true }}
                            style={{ marginBottom: "8px" }}
                          >
                            {item.description}
                          </Paragraph>
                          <Text
                            className="item-id"
                            style={{
                              fontSize: "18px",
                              fontWeight: 700,
                              color: "#999999",
                            }}
                          >
                            #{item.id}
                          </Text>
                          <NumberField
                            style={{
                              fontSize: "24px",
                              fontWeight: 500,
                              marginBottom: "8px",
                            }}
                            options={{
                              currency: "USD",
                              style: "currency",
                            }}
                            value={item.price}
                          />
                          {updateStock && (
                            <div id="stock-number">
                              <InputNumber
                                size="large"
                                keyboard
                                min={0}
                                value={item.stock || 0}
                                // onChange={(value: number | null) => updateStock(value ?? 0, item)}
                                style={{ width: "100%" }}
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    </Col>
                  );
                })}
              </Row>

              <Row>
                <Col xs={0} sm={6}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "40px",
                      marginBottom: "16px",
                    }}
                  >
                    <Text style={{ fontWeight: 500 }}>
                      {/* {t("stores.tagFilterDescription")} */}
                    </Text>
                  </div>
                  <Form.Item name="categories">
                    {/* <ProductCategoryFilter /> */}
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </section>
          <section>
            <Modal
              // {...modalProps}
              visible={isModalVisible}
              onCancel={handleCancel}
              width={1000}
              footer={null}
              bodyStyle={{ minHeight: "650px" }}
            >
              <CreateProduct />
            </Modal>
          </section>
        </main>
      </QueryClientProvider>
    </>
  );
};

export default StoreProducts;