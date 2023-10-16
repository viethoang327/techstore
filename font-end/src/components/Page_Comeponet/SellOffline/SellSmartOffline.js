import React, { useState, useEffect,useRef } from "react";
import { useTranslate } from "@refinedev/core";
import {
    ShoppingCartOutlined,GiftOutlined
  } from '@ant-design/icons';
import {
  Layout,
  theme,
  DatePicker,FallOutlined,RiseOutlined, Modal,  Select,Image,Button,Table
} from "antd";
import {getVoucher,getVoucherFreeShip} from "../../../service/Voucher/voucher.service";
import {getSKUProductFormSell} from "../../../service/sku.service"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import AvtProduct from "../../custumer_componet/avtProduct";
import queryString from "query-string";
import Pagination from "./Paging";
const { Header, Sider, Content } = Layout;

export default function SellSmart() {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị Modal
  const [isModalVisibleVoucher, setIsModalVisibleVoucher] = useState(false); // Trạng thái hiển thị Modal Voucher 
  const [voucher, setVoucher] = useState([]);
  const [selecteVoucher, setSelectedVoucher] = useState(0);
  const [voucherFreeShip, setVoucherFreeShip] = useState([true]);
  const [selecteVoucherFreeShip, setSelectedVoucherFreeShip] = useState(0);
  const [skuProduct, setSkuProduct] = useState([]);

  const [pagination, setPagination] = useState({
    page: 0,
    limit: 5,
    totalRows: 1,
  });
  const [filters, setFilters] = useState({
    page: 0,
    key: "",
  });

  useEffect(() => {
        //lấy danh sách voucher
        getVoucher()
        .then((response) => {
            console.log(response.data);
            setVoucher(response.data);
        })
        .catch((error) => {
            console.log(`${error}`);
        });

        //lấy danh sách voucher
        getVoucherFreeShip()
        .then((response) => {
          console.log(response.data);
          setVoucherFreeShip(response.data);
        })
        .catch((error) => {
          console.log(`${error}`);
        });

        //lấy danh sách sanr phaam
        const paramsString = queryString.stringify(filters);
        getSKUProductFormSell(paramsString)
        .then((response) => {
          console.log(response.data.content);
          setSkuProduct(response.data.content);
          setPagination(response.data.content);
        })
        .catch((error) => {
          console.log(`${error}`);
  });
  }, [filters]);

  function handlePageChange(newPage) {
    console.log("New Page: " + newPage);
    setFilters({
      ...filters,
      page: newPage,
    });
  }
    // Hàm để hiển thị Modal khi cần
    const handleEditClick = (record) => {
        setIsModalVisible(true);
    };

    // Hàm để ẩn Modal
    const handleCancel = () => {
        setIsModalVisible(false);
    };

     // Hàm để hiển thị Modal khi cần
     const handleEditClickVoucher = (record) => {
        setIsModalVisibleVoucher(true);
    };

    // Hàm để ẩn Modal
    const handleCancelVoucher = () => {
        setIsModalVisibleVoucher(false);
    };

    function giaoTanNoi() {
        const select = document.getElementById("floatingSelect2");
        select.hidden = false;
      }

      function taiCuaHang() {
        const select = document.getElementById("floatingSelect2");
        select.hidden = true;
      }

      const toast = useRef(null);
      const reject = () => {
        toast.current.show({
          severity: "warn",
          summary: "Rejected",
          detail: "You have rejected",
          life: 3000,
        });
      };
      const confirm2 = () => {
        confirmDialog({
          message: "Do you want to delete this record?",
          header: "Delete Confirmation",
          icon: "pi pi-info-circle",
          acceptClassName: "p-button-danger",
          accept: "/",
          reject,
        });
      };

    return(
    <React.Fragment>
      <>
      <Layout>
        <Layout>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: 280,
              background: colorBgContainer,
            }}
          >
            <main className="app app-ban-hang">
                <div className="row">
                    <div className="col-md-12">
                    <div className="app-title">
                        <ul className="app-breadcrumb breadcrumb">
                        <li className="breadcrumb-item">
                            <a href="#">
                            <b>POS bán hàng</b>
                            </a>
                        </li>
                        </ul>
                        <div id="clock" />
                    </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        {/* <div className="tile"> */}
                        <div className="row">
                            <div className="col-md-4">
                                <label className="control-label" style={{fontWeight: "bold"}}>Tìm kiếm sản phẩm</label>
                                <input
                                className="form-control"
                                type="text"
                                placeholder="Tìm kiếm sản phẩm"
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="control-label" style={{fontWeight: "bold"}}>Phân loại sản phẩm</label>
                                <select className="form-control" id="exampleSelect1">
                                <option>--- Chọn sản phẩm ---</option>
                                
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="control-label" style={{fontWeight: "bold"}}>Sắp xếp</label> <br/>
                                <button type="button" class="btn btn-secondary" style={{marginRight: "10px"}}>
                                    {/* <FallOutlined /> */} Giảm dần
                                </button>
                                <button type="button" class="btn btn-secondary">
                                    {/* <RiseOutlined /> */} Tăng dần
                                </button>
                            </div>
                        </div>
                        
                        <h5 style={{marginTop: "10px", marginBottom: "10px"}}>Sản phẩm</h5>
                        <table className="table" >
                            <thead className ="thead-dark">
                              <tr>
                                  <th className="so--luong">Ảnh</th>
                                  <th className="so--luong">Tên sản phẩm</th>
                                  <th className="so--luong">Giá bán</th>
                                  <th className="so--luong" >Kho</th>
                                  <th className="so--luong text-center"/>
                              </tr>
                            </thead>
                            <tbody style={{ position: "relative",height: "100px"}}>
                            {skuProduct.map((product) => (
                            <tr>
                                <td style={{width: "200px"}}>
                                    <AvtProduct
                                      product={product.idProduct}
                                    ></AvtProduct>
                                </td>
                                <td><h6 className="text-primary">{product.nameProduct} {product.nameCapacity} {product.nameColor}</h6></td>
                                <td>{parseFloat(product.price).toLocaleString(
                                      "vi-VN",
                                      {
                                        style: "currency",
                                        currency: "VND",
                                      }
                                    )}</td>
                                <td>{product.quantitySKU}</td>
                                <td >
                                <button
                                    className="btn btn-primary btn-sm trash"
                                    type="button"
                                    title="Xóa"
                                >
                                    <ShoppingCartOutlined />
                                </button>
                                </td>
                            </tr>
                            ))}
                            </tbody>
                        </table>
                        <Pagination pagination={pagination} onPageChange={handlePageChange} />

                        <h5 style={{marginTop: "10px", marginBottom: "10px"}}>Giỏ hàng</h5>
                        <table class="table">
                            <thead class="thead-dark">
                            <tr>
                                <th className="so--luong">Ảnh</th>
                                <th className="so--luong">Tên sản phẩm</th>
                                <th className="so--luong">Giá</th>
                                <th className="so--luong">
                                Giảm giá
                                </th>
                                <th className="so--luong">SL x Tổng tiền</th>
                                <th className="so--luong">Emei</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>71309005</td>
                                <td>Bàn ăn gỗ Theresa</td>
                                <td>
                                <img src="/img-sanpham/reno.jpg" alt="" width="50px;" />
                                </td>
                                
                                <td>5.600.000 </td>
                                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                                <button
                                    className="btn btn-primary btn-sm trash"
                                    type="button"
                                    title="Xóa"
                                >
                                    <i className="fas fa-trash-alt" />
                                </button>
                                </td>
                            </tr>
                            
                            <tr></tr>
                            </tbody>
                        </table>
                        {/* </div> */}
                    </div>
                    <div className="col-md-3">
                    <div className="tile">
                        <h3 className="tile-title">Thông tin thanh toán</h3>
                        <div className="row">
                        <div className="form-group  col-md-10">
                            <label className="control-label" style={{fontWeight: "bold"}}>Họ tên khách hàng</label>
                            <input
                            className="form-control"
                            type="text"
                            placeholder="Tìm kiếm khách hàng"
                            />
                        </div>
                        <div className="form-group  col-md-2">
                            <label style={{ textAlign: "center" }} className="control-label">
                            NEW
                            </label>
                            <button
                            className="btn btn-secondary btn-them"
                            data-toggle="modal"
                            data-target="#exampleModalCenter"
                            onClick={() => handleEditClick()}
                            >
                                +
                            </button>
                        </div>
                        <div className="form-group  col-md-12">
                            <label className="control-label" style={{fontWeight: "bold"}}>Ghi chú đơn hàng</label>
                            <textarea
                            className="form-control"
                            rows={4}
                            placeholder="Ghi chú thêm đơn hàng"
                            defaultValue={""}
                            />
                        </div>
                        <div className="form-group  col-md-12">
                            <label className="control-label" style={{fontWeight: "bold"}}>Địa chỉ nhận hàng</label>
                            <br/>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" value="option1" onClick={() => taiCuaHang()}/>
                                <label class="form-check-label" for="inlineRadio1">Tại cửa hàng</label>
                            </div>
                            <div class="form-check form-check-inline">
                                <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" value="option2" onClick={() => giaoTanNoi()}/>
                                <label class="form-check-label" for="inlineRadio2">Ship hàng</label>
                            </div>
                                <input
                                hidden
                                id="floatingSelect2"
                                class="form-control"
                                type="text"
                                placeholder="Địa chỉ cụ thể"
                                aria-label="default input example"
                                />
                        </div>
                        <div className="form-group  col-md-12">
                            <label className="control-label" style={{fontWeight: "bold"}}>Phí vận chuyển: </label>
                            <input className="form-control" type="number" defaultValue={0} />
                        </div>
                        <div className="form-group  col-md-12">
                            <label className="control-label" style={{fontWeight: "bold"}}>Ngày giao hàng: </label>
                            <DatePicker
                            id="dateFilter"
                            style={{ width: "100%" }}
                            // onChange={handleChangeDate}
                          />
                        </div>
                        </div>
                        <div className="row">
                        <div className="form-group  col-md-12">
                            <label className="control-label" style={{fontWeight: "bold"}}>Hình thức thanh toán</label>
                            {/* <select className="form-control" id="exampleSelect2" mode="multiple">
                                <option>Thanh toán chuyển khoản</option>
                                <option>Trả tiền mặt tại quầy</option>
                            </select> */}
                            <Select
                                mode="multiple"
                                style={{ width: "100%" }}
                            >
                                <Select.Option>
                                Thanh toán chuyển khoản
                                </Select.Option>
                                <Select.Option>
                                Trả tiền mặt tại quầy
                                </Select.Option>
                            </Select>
                        </div>
                        <div className="form-group  col-md-6" style={{color: "red"}}>
                            <label className="control-label">Tổng tiền hàng: </label>
                            <p className="control-all-money-tamtinh">= 129.397.213 VNĐ</p>
                        </div>
                        <div className="form-group  col-md-6">
                            <label className="control-label">Giảm giá: </label>
                            <p className="control-all-money-tamtinh" onClick={() => handleEditClickVoucher()}>Chọn Voucher</p>
                        </div>
                        <div className="form-group  col-md-6" style={{color: "red"}}>
                            <label className="control-label" >Giảm giá Voucher: </label>
                            <p className="control-all-money-total">= 129.397.213 VNĐ</p>
                        </div>
                        <div className="form-group  col-md-6" >
                            <label className="control-label">Khách hàng đưa tiền: </label>
                            <input
                            className="form-control"
                            type="number"
                            defaultValue={290000}
                            />
                        </div>
                        <div className="form-group  col-md-6" style={{color: "red"}}>
                            <label className="control-label" >Khách cần trả: </label>
                            <p className="control-all-money"> - 129.397.213 VNĐ</p>
                        </div>
                         <div className="form-group  col-md-6" style={{fontWeight: "bold"}}>
                            <label className="control-label" >Thiếu: </label>
                            <p className="control-all-money"> - 129.397.213 VNĐ</p>
                        </div>
                        <div className="tile-footer col-md-12">
                            <button className="btn btn-danger luu-san-pham" type="button" style={{marginRight: "10px", marginBottom: "10px"}}>
                            {" "}
                            Chờ thanh toán
                            </button>
                            <button className="btn btn-danger luu-va-in" type="button" style={{marginRight: "10px", marginBottom: "10px"}} onClick={() => confirm2()}>
                            Lưu hóa đơn
                            </button>
                            <a className="btn btn-secondary luu-va-in" href="/dashboard" style={{ marginBottom: "10px"}}>
                            Quay về
                            </a>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                
                </main>
        </Content>
        </Layout>
      </Layout>
      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
        width={1000}
        footer={null}
        bodyStyle={{ minHeight: "400px" }}
    >
        {/* <div className="modal-body"> */}
            <div className="row">
                <div className="form-group  col-md-12">
                    <span className="thong-tin-thanh-toan">
                        <h5>Tạo mới khách hàng</h5>
                    </span>
                </div>
                <div clclassNameass="form-group col-md-12">
                    <label className="control-label">Họ và tên</label>
                    <input className="form-control" type="text" required/>
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label">Địa chỉ</label>
                    <input className="form-control" type="text" required/>
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label">Email</label>
                    <input className="form-control" type="text" required/>
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label">Ngày sinh</label>
                    <input className="form-control" type="date" required/>
                </div>
                <div className="form-group col-md-6">
                    <label className="control-label">Số điện thoại</label>
                    <input className="form-control" type="number" required/>
                </div>
            </div>
            <br/>
            <button class="btn btn-save" type="button">Lưu lại</button>
            <a class="btn btn-cancel" data-dismiss="modal" href="#">Hủy bỏ</a>
            <br/>
        {/* </div> */}
    </Modal>

    <Modal
        visible={isModalVisibleVoucher}
        onCancel={handleCancelVoucher}
        width={550}
        footer={null}
        bodyStyle={{ minHeight: "700px" }}
    >
        <div className="container py-5">
          <div className="row d-flex justify-content-center">
            {/* <div className="card"> */}
            <div
              className="card-header d-flex justify-content-between align-items-center p-3"
              style={{ borderTop: "4px solid #ffa900" }}
            >
              <h5 className="mb-0">VOUCHER CỦA SHOP</h5>
            </div>
            <p style={{marginTop: "10px"}}>Mã FreeShip</p>
            <div
              className="card-body"
              data-mdb-perfect-scrollbar="true"
              style={{ position: "relative", height: 200, overflowY: 'auto' }}
            >
              {voucherFreeShip.map((voucher) => (
                 <ul class="list-group mb-3">
                  <li class="list-group-item d-flex justify-content-between">
                    <span>
                      <Image
                        style={{
                          width: "100px",
                        }}
                        src="https://bizweb.dktcdn.net/100/377/231/articles/freeship.png?v=1588928233387"
                      />
                    </span>
                    <span style={{paddingLeft: "10px"}}>
                      {voucher.name}
                      <br/>
                      <p style={{color: "red", fontSize: "15px"}}>Giảm {voucher?.valueVoucher?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}</p>
                      <p>Đơn giá trị tối thiểu {voucher.valueMinimum} 
                      <br/>
                       Đơn giá trị tối đa {voucher.valueMaximum}</p>
                    </span>
                    <strong>
                      {/* <Checkbox
                        onClick={() => handleVoucherClick(voucher)}
                      /> */}
                      <Button type="text" danger >
                        Áp dụng
                      </Button>
                      <br/>
                      <Button type="text"  danger >
                        Hủy
                      </Button>
                    </strong>
                  </li>
              </ul>
              ))}
              
            </div>
            <p style={{marginTop: "10px"}}>Mã Giảm giá</p>
            <div
              className="card-body"
              data-mdb-perfect-scrollbar="true"
              style={{ position: "relative", height: 330, overflowY: 'auto' }}
            >
              {voucher.map((voucher) => (
                <ul class="list-group mb-3">
                  <li class="list-group-item d-flex justify-content-between">
                    <span>
                      <Image
                        style={{
                          width: "100px",
                        }}
                        src="https://help.turitop.com/hc/article_attachments/360007926459/voucher.png"
                      />
                    </span>
                    <span style={{ paddingLeft: "10px" }}>
                      {voucher.name}
                      <br />
                      <p style={{ color: "red", fontSize: "15px" }}>
                        Giảm{" "}
                        {voucher?.valueVoucher?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </p>
                      <p>
                        Đơn giá trị tối thiểu {voucher.valueMinimum}
                        <br />
                        Đơn giá trị tối đa {voucher.valueMaximum}
                      </p>
                    </span>
                    <strong>
                      <Button type="text" danger>
                        Áp dụng
                      </Button>
                      <br />
                      <Button
                        type="text"
                        danger
                       
                      >
                        Hủy
                      </Button>
                    </strong>
                  </li>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </Modal>
      </>
    </React.Fragment>
    )
   
}