import React, { useEffect, useState } from "react";
import { readAll,add, detail, update } from "../../../service/Voucher/voucher.service";
import { useTranslate } from "@refinedev/core";
import {
  Form,
  Input,
  Row,
  Col,
  DatePicker,
  Image,
  Button,notification,
} from "antd";

import {
  // Link,
  useHistory,
  // useParams,
} from "react-router-dom/cjs/react-router-dom.min";


const UpdateVoucher = ({editedVoucher}) => {
  const t = useTranslate();
  const history = useHistory();

  const [voucher, setVoucher] = useState([]);

  useEffect(() => {
    detail(editedVoucher.id)
      .then((response) => {
      setVoucher(response.data);
      console.log(response.data);
    })
    .catch((error) => {
      console.log(`${error}`);
    });
  }, []);

  function handleChangeDatePicker(value, name) {
    setVoucher((prevVoucher) => ({
      ...prevVoucher,
      [name]: value,
    }));
  }

  function handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = { ...voucher };
    item[name] = value;
    setVoucher(item);
  }

const handleSubmit = (event) => {
    event.preventDefault();
    const items = { ...voucher };
      update(editedVoucher.id, items)
        .then(() => {
          // Cập nhật thành công, thực hiện các hành động cần thiết
          notification.success({
            message: "UPDATE VOUCHER",
            description: "Update Voucher successfully",
          });
          history.push("/voucher");
          return {
            success: true,
          };
        })
        .catch((error) => {
          console.error(`Error updating voucher: ${error}`);
        });
  };
  


  return (
    <form onSubmit={handleSubmit}>
                    <Form
                        layout="vertical"
                        dataSource={voucher}
                        initialValues={{
                        isActive: true,
                        }}
                    >
                        <Row gutter={[64, 0]} wrap>
                        <Col xs={24} lg={8}>
                            
                            <label style={{
                                paddingTop: "5px",
                            }}>Code</label>
                            <Input
                                type="text"
                                required
                                value={voucher.code }
                                onChange={handleChange}
                                id="code"
                                name="code"
                            />
                            
                            <label style={{
                                paddingTop: "20px",
                            }}>Name</label>
                            <Input
                                type="text"
                                required
                                value={voucher.name }
                                onChange={handleChange}
                                id="name"
                                name="name"
                            />
                            

                            <Form.Item
                            label={t("Date Start")}
                            name="dateStart"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <DatePicker
                                type="text"
                                required
                                value={voucher.dateStart}
                                onChange={(date, dateString) =>
                                handleChangeDatePicker(dateString, "dateStart")
                                }
                                id="dateStart"
                                name="dateStart"
                            />
                            </Form.Item>

                            <Form.Item
                            label={t("Date End")}
                            name="dateEnd"
                            rules={[
                                {
                                required: true,
                                },
                            ]}
                            >
                            <DatePicker
                                type="text"
                                required
                                value={voucher.dateEnd}
                                onChange={(date, dateString) =>
                                handleChangeDatePicker(dateString, "dateEnd")
                                }
                                id="dateEnd"
                                name="dateEnd"
                            />
                            </Form.Item>
                            
                            <label style={{
                                paddingTop: "20px",
                            }}>Value Maximum</label>
                            <Input
                                type="number"
                                required
                                value={voucher.valueMaximum }
                                onChange={handleChange}
                                id="valueMaximum"
                                name="valueMaximum"
                            />
                           
                        </Col>
                        <Col xs={24} lg={8}>

                        <label style={{
                                paddingTop: "20px",
                            }}>Quantity</label>
                            <Input
                                type="number"
                                required
                                value={voucher.quantity }
                                onChange={handleChange}
                                id="quantity"
                                name="quantity"
                            />

                             <label style={{
                                paddingTop: "20px",
                            }}>Conditions Apply</label>
                            <Input
                                type="number"
                                required
                                value={voucher.conditionsApply }
                                onChange={handleChange}
                                id="conditionsApply"
                                name="conditionsApply"
                            />

                            <label style={{
                                paddingTop: "20px",
                            }}>Value Voucher</label>
                            <Input
                                type="number"
                                required
                                value={voucher.valueVoucher }
                                onChange={handleChange}
                                id="valueVoucher"
                                name="valueVoucher"
                            />

                             <label style={{
                                paddingTop: "20px",
                            }}>Value Minimum</label>
                            <Input
                                type="number"
                                required
                                value={voucher.valueMinimum }
                                onChange={handleChange}
                                id="giaTriToiThieu"
                                name="giaTriToiThieu"
                            />

                            <label style={{
                                paddingTop: "20px",
                            }}>Type Voucher</label>
                            <Input
                                type="number"
                                required
                                value={voucher.typeVoucher}
                                onChange={handleChange}
                                id="typeVoucher"
                                name="typeVoucher"
                            />
                           
                        </Col>
                        <Col xs={24} lg={8}>
                           
                        <Image
                            style={{
                                width: "300px",
                                paddingTop: "80px",
                                paddingRight: "30px",
                            }}
                            src="https://cdn2.cellphones.com.vn/358x358,webp,q100/media/catalog/product/t/_/t_m_12.png"
                            />
                        </Col>
                        </Row>
                    </Form>
                    {/* </Create> */}
                    <Button
                        htmlType="submit"
                        type="primary"
                        size="large"
                        // block
                    >
                        {t("UPDATE")}
                    </Button>
                    </form>
  );
};
export default UpdateVoucher;
