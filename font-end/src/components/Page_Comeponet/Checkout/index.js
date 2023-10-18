import * as React from "react";
import "../Checkout/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
import Header from "../../Page_Comeponet/layout/Header";
import Footer from "../../Page_Comeponet/layout/Footer";
import { useState } from "react";
import { readAll } from "../../../service/cart.service";
import { readQuantityInCart } from "../../../service/cart.service";
import { GiftOutlined } from "@ant-design/icons";
import { Image, Checkbox, Modal, notification, Button, Input } from "antd";
import {
  getVoucher,
  getVoucherFreeShip,
} from "../../../service/Voucher/voucher.service";
import { getPay } from "../../../service/Vnpay/vnpay.service";
import { readAllWard } from "../../../service/AddressAPI/ward.service";
import { readAllDistrict } from "../../../service/AddressAPI/district.service";
import { readAllProvince } from "../../../service/AddressAPI/province.service";
import { getFee } from "../../../service/AddressAPI/fee.service";
import { get } from "jquery";
import { Link } from "react-router-dom";
import { createBill } from "../../../service/Bill/bill.service";

const Checkout = () => {
  const [isLogin, setIsGLogin] = useState([false]);
  const [products, setProducts] = useState([]);
  const [quantityCart, setQuantity] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [priceShip, setPriceShip] = useState([]);
  const [soTienThanhToan, setSoTienThanhToan] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị Modal
  const [voucher, setVoucher] = useState([]);
  const [selecteVoucher, setSelectedVoucher] = useState(0);
  const [linkPay, setLinkPay] = useState(["/paydone"]);
  const [isChecked, setIsChecked] = useState([true]);
  const [voucherFreeShip, setVoucherFreeShip] = useState([true]);
  const [selecteVoucherFreeShip, setSelectedVoucherFreeShip] = useState(0);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [province_id, setProvince_id] = useState();
  const [district_id, setDistrict_id] = useState();
  const [fee, setFee] = useState([]);
  const [transportationFeeDTO, setTransportationFeeDTO] = useState({
    toDistrictId: null,
    toWardCode: null,
    insuranceValue: null,
    quantity: 1,
  });
  const [bill, setBill] = useState({
    userName: "",
    phoneNumber: "",
    email: "",
    address: "",
    province: "",
    district: "",
    moneyShip: 0,
    itemDiscount: 0,
    totalMoney: 0,
    paymentMethod: "ONLINE",
    billDetail: [],
    afterPrice: 0,
    idVoucher: null,
    wards: "",
  });

  useEffect(() => {
    //hiển thị giỏ hàng
    readAll(1)
      .then((response) => {
        const list = response.data;
        setProducts(list);
        const adidaphat = [];
        list.map((item) => {
          adidaphat.push({
            idProductDetail: item.idProduct,
            price: item.price,
            quantity: item.quantity,
          });
        });
        setBill({
          ...bill,
          billDetail: adidaphat,
        });
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    //số lượng sản phẩm tỏng giỏ hàng
    readQuantityInCart(1)
      .then((response) => {
        console.log(response.data);
        setQuantity(response.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
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
    readAllProvince()
      .then((response) => {
        setProvinces(response.data.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    readAllDistrict(province_id)
      .then((response) => {
        setDistricts(response.data.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    readAllWard(district_id)
      .then((response) => {
        setWards(response.data.data);
      })
      .catch((error) => {
        console.log(`${error}`);
      });
    if (transportationFeeDTO != []) {
      getFee(transportationFeeDTO)
        .then((response) => {
          setFee(response.data.data);
        })
        .catch((error) => {
          console.log(`${error}`);
        });
    }
  }, [isLogin, province_id, district_id, transportationFeeDTO, priceShip]);

  function giaoTanNoi() {
    const select = document.getElementById("floatingSelect1");
    select.hidden = true;
    const input = document.getElementById("floatingSelect2");
    input.hidden = false;
    const divDcmd = document.getElementById("dcmd2");
    divDcmd.hidden = true;
    const notDcmd = document.getElementById("notDcmd");
    notDcmd.hidden = false;
  }

  function nhanTaiCuaHang() {
    const select = document.getElementById("floatingSelect1");
    select.hidden = false;
    const input = document.getElementById("floatingSelect2");
    input.hidden = true;
    const divDcmd = document.getElementById("dcmd2");
    divDcmd.hidden = true;
    const notDcmd = document.getElementById("notDcmd");
    notDcmd.hidden = false;
  }

  function diaChiMacDinh() {
    const divDcmd = document.getElementById("dcmd2");
    divDcmd.hidden = false;
    const notDcmd = document.getElementById("notDcmd");
    notDcmd.hidden = true;
  }

  function test() {
    setIsGLogin(true);
    if (isLogin == true) {
      const divDcmd = document.getElementById("dcmd");
      divDcmd.hidden = false;
    }
  }
  useEffect(() => {
    calculatePriceSucsses();
  }, [products, fee]);
  //tính số tiền cẩn thanh toán
  const calculatePriceSucsses = () => {
    //tính thành tiền sản phẩm
    let total = 0;
    products.forEach((product) => {
      // Chuyển đổi giá trị total từ dạng chuỗi sang số và cộng vào tổng
      const productTotal = parseFloat(product.total);
      total += productTotal;
    });
    setTotalPrice(total);
    //tính phí ship
    let priceS = 0;
    // if (total <= 20000000) {
    //   priceS = 30000;
    // } else if (total > 20000000 && total <= 60000000) {
    //   priceS = 40000;
    // } else if (total > 60000000 && total <= 100000000) {
    //   priceS = 60000;
    // } else if (total > 100000000) {
    //   priceS = 80000;
    // }
    if (fee != null) {
      priceS = fee?.total;
    }
    setPriceShip(priceS);
    //tính số tiền cẩn thanh toán
    let price = 0;

    if (selecteVoucherFreeShip && selecteVoucher) {
      const voucherValue = parseFloat(selecteVoucher.valueVoucher);
      const voucherVoucherFree = parseFloat(
        selecteVoucherFreeShip.valueVoucher
      );
      price = total + priceS - (voucherValue + voucherVoucherFree);
    } else if (selecteVoucher) {
      // Nếu selectedVoucher có giá trị, sử dụng giá trị voucher
      const voucherValue = parseFloat(selecteVoucher.valueVoucher);
      price = total + priceS - voucherValue;
    } else if (selecteVoucherFreeShip) {
      // Nếu chỉ có selectedVoucherFreeShip có giá trị, sử dụng giá trị voucherfreeship
      const voucherVoucherFree = parseFloat(
        selecteVoucherFreeShip.valueVoucher
      );
      price = total + priceS - voucherVoucherFree;
    } else {
      // Nếu cả hai đều không có giá trị, không sử dụng giảm giá
      price = total + priceS;
    }
    setSoTienThanhToan(price);
  };
  //click Voucher
  const handleVoucherClick = (voucher) => {
    if (
      totalPrice < voucher.valueMinimum ||
      totalPrice > voucher.valueMaximum
    ) {
      notification.error({
        message: "VOUCHER",
        description: "Không thể áp dụng do đơn hàng không đủ điều kiện",
      });
    } else {
      setSelectedVoucher(voucher);
      readAll(1)
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(`${error}`);
        });
    }
  };

  //clear voucher
  const handleClearVoucher = (id) => {
    if (selecteVoucher.id === id) {
      setSelectedVoucher(null);
      readAll(1)
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(`${error}`);
        });
    }
  };

  //click Voucher freeship
  const handleVoucherFreeShipClick = (voucher) => {
    if (
      totalPrice < voucher.valueMinimum ||
      totalPrice > voucher.valueMaximum
    ) {
      notification.error({
        message: "VOUCHER",
        description: "Không thể áp dụng do đơn hàng không đủ điều kiện",
      });
    } else {
      setSelectedVoucherFreeShip(voucher);
      readAll(1)
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(`${error}`);
        });
    }
  };

  //clear voucher freeship
  const handleClearVoucherFreeShip = (id) => {
    if (selecteVoucherFreeShip.id === id) {
      setSelectedVoucherFreeShip(null);
      readAll(1)
        .then((response) => {
          console.log(response.data);
          setProducts(response.data);
        })
        .catch((error) => {
          console.log(`${error}`);
        });
    }
  };

  // Hàm để hiển thị Modal khi cần
  const handleEditClick = (record) => {
    if (totalPrice <= 20000000) {
      notification.error({
        message: "VOUCHER",
        description: "Đơn hàng chưa đủ điều kiện (Tối thiểu 20.000.000 đ)",
      });
    } else {
      setIsModalVisible(true);
    }
  };

  // Hàm để ẩn Modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  function datHang() {
    const tienMat = document.getElementById("httt-1");
    if (tienMat.checked === true) {
      setIsChecked(true);
      setLinkPay("/paydone");
    }
    const vnpay = document.getElementById("httt-2");
    if (vnpay.checked == true) {
      getPay(soTienThanhToan)
        .then((res) => {
          setLinkPay(res.data);
          setIsChecked(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const handleProvince = (event) => {
    const target = event.target;
    const value = target.value;
    setProvince_id(value);
    console.log(value);
    setDistrict_id(null);
    setWards([]);
    let item = {
      toDistrictId: null,
      toWardCode: null,
      insuranceValue: null,
      quantity: quantityCart,
    };
    setTransportationFeeDTO(item);
    setBill({
      ...bill,
      province: document.getElementById(value).innerText,
    });
  };

  const handleDistrict = (event) => {
    const target = event.target;
    const value = target.value;
    setDistrict_id(value);
    let item = { ...transportationFeeDTO };
    item["toDistrictId"] = parseInt(value);
    item["insuranceValue"] = parseInt(soTienThanhToan);
    setTransportationFeeDTO(item);
    console.log(transportationFeeDTO);
    setBill({
      ...bill,
      district: document.getElementById(value).innerText,
    });
  };

  const handleWard = (event) => {
    const target = event.target;
    const value = target.value;
    let item = { ...transportationFeeDTO };
    item["toWardCode"] = value;
    setTransportationFeeDTO(item);
    console.log(transportationFeeDTO);
    setBill({
      ...bill,
      wards: document.getElementById(value).innerText,
    });
    console.log(bill);
  };

  function hanldeName(event) {
    setBill({
      ...bill,
      userName: event.target.value,
    });
  }

  function hanldPhone(event) {
    setBill({
      ...bill,
      phoneNumber: event.target.value,
    });
  }

  function hanldeMail(event) {
    setBill({
      ...bill,
      email: event.target.value,
    });
  }

  function handleSubmit() {
    createBill(bill)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Header />
      <button onClick={() => test()}>test</button>
      <main role="main">
        <div class="container mt-4">
          <form
            class="needs-validation"
            name="frmthanhtoan"
            onSubmit={handleSubmit}
          >
            <input type="hidden" name="kh_tendangnhap" value="dnpcuong"></input>
            <div class="py-5 text-center">
              <i class="fa fa-credit-card fa-4x" aria-hidden="true"></i>
              <h2>Thanh toán</h2>
              <p class="lead">
                Vui lòng kiểm tra thông tin Khách hàng, thông tin Giỏ hàng trước
                khi Đặt hàng.
              </p>
            </div>
            <div class="row">
              <div class="col-md-4 order-md-2 mb-4">
                <h4 class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted">Giỏ hàng</span>
                  <span class="badge badge-secondary badge-pill">
                    {quantityCart}
                  </span>
                </h4>
                <ul class="list-group mb-3">
                  {products.map((product) => (
                    <li class="list-group-item d-flex justify-content-between lh-condensed">
                      <div>
                        <h6 class="my-0">
                          {product.nameProduct} {product.capacity}{" "}
                          {product.color}
                        </h6>
                        <small class="text-muted">
                          {product.price} x {product.quantity}
                        </small>
                      </div>
                      <span class="text-muted">
                        {parseFloat(product.total).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </li>
                  ))}
                  <li class="list-group-item d-flex justify-content-between">
                    <span>Tổng thành tiền</span>
                    <strong>
                      {totalPrice?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </strong>
                  </li>
                </ul>
                <ul class="list-group mb-3">
                  <li class="list-group-item d-flex justify-content-between">
                    <span>Voucher của Shop</span>
                    <strong>
                      <GiftOutlined onClick={() => handleEditClick()} />
                    </strong>
                  </li>
                </ul>
                <div className="d-flex justify-content-between px-x">
                  <p className="fw-bold">Giảm giá Voucher:</p>
                  <p className="fw-bold">
                    -
                    {selecteVoucher && selecteVoucher.valueVoucher
                      ? selecteVoucher?.valueVoucher?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                      : 0?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </p>
                </div>
                <div className="d-flex justify-content-between px-x">
                  <p className="fw-bold">Tiền vận chuyển:</p>
                  <p className="fw-bold">
                    {fee == null
                      ? 0 + "₫"
                      : fee?.total?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </p>
                </div>
                <div className="d-flex justify-content-between px-x">
                  <p className="fw-bold">Giảm giá tiền vận chuyển:</p>
                  <p className="fw-bold">
                    -
                    {selecteVoucherFreeShip &&
                    selecteVoucherFreeShip.valueVoucher
                      ? selecteVoucherFreeShip?.valueVoucher?.toLocaleString(
                          "vi-VN",
                          {
                            style: "currency",
                            currency: "VND",
                          }
                        )
                      : 0?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                  </p>
                </div>
                <div
                  className="d-flex justify-content-between p-2 mb-2"
                  style={{ backgroundColor: "#e1f5fe" }}
                >
                  <h5 className="fw-bold mb-0">THANH TOÁN:</h5>
                  <h5 className="fw-bold mb-0" style={{ color: "red" }}>
                    {soTienThanhToan?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </h5>
                </div>
              </div>
              <div class="col-md-8 order-md-1">
                <h4 class="mb-3">Thông tin khách hàng</h4>
                <div class="row">
                  <div class="col-md-12">
                    <input
                      type="text"
                      class="form-control"
                      placeholder="Tên"
                      onChange={hanldeName}
                    ></input>
                    <br />
                  </div>
                  <div className="row">
                    <div class="col-md-6">
                      <input
                        type="text"
                        class="form-control"
                        placeholder="Số điện thoại"
                        onChange={hanldPhone}
                      ></input>
                    </div>
                    <div class="col-md-6">
                      <input
                        type="email"
                        class="form-control"
                        placeholder="Email"
                        onChange={hanldeMail}
                      ></input>
                    </div>
                  </div>
                  <div class="col-md-12">
                    <br />
                    <b for="kh_ngaysinh">Hình thức nhận hàng</b>
                    <div class="custom-control custom-radio">
                      <input
                        id="htnn_4"
                        name="htnn_ma"
                        type="radio"
                        class="custom-control-input"
                        required=""
                        value="1"
                        checked
                        onClick={() => nhanTaiCuaHang()}
                      ></input>
                      <label class="custom-control-label" for="htnn_4">
                        Nhận tại cửa hàng
                      </label>
                    </div>
                    <div class="custom-control custom-radio">
                      <input
                        id="htnn_5"
                        name="htnn_ma"
                        type="radio"
                        class="custom-control-input"
                        required=""
                        value="2"
                        onClick={() => giaoTanNoi()}
                      ></input>
                      <label class="custom-control-label" for="htnn_5">
                        Giao tận nơi
                      </label>
                    </div>
                    <div class="custom-control custom-radio" id="dcmd" hidden>
                      <input
                        id="htnn_6"
                        name="htnn_ma"
                        type="radio"
                        class="custom-control-input"
                        required=""
                        value="3"
                        onClick={() => diaChiMacDinh()}
                        hidden
                      ></input>
                      <label class="custom-control-label" for="htnn_6">
                        Địa chỉ mặc định
                      </label>
                    </div>
                  </div>
                  <div className="row" id="notDcmd">
                    <div class="col-md-4">
                      <br />
                      <label for="kh_cmnd">Tỉnh, thành phố:</label>
                      <select
                        class="form-select"
                        id="provinces"
                        aria-label="Floating label select example"
                        onChange={handleProvince}
                      >
                        <option value={"undefined"} selected></option>
                        {provinces.map((pr) => {
                          return (
                            <option key={pr.ProvinceID} value={pr.ProvinceID}>
                              {pr.ProvinceName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div class="col-md-4">
                      <br />
                      <label for="kh_cmnd">Quận, huyện:</label>
                      <select
                        class="form-select"
                        id="districts"
                        aria-label="Floating label select example"
                        onChange={handleDistrict}
                      >
                        <option selected></option>
                        {districts.map((dt) => {
                          return (
                            <option key={dt.DistrictID} value={dt.DistrictID}>
                              {dt.DistrictName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div class="col-md-4">
                      <br />
                      <label for="kh_cmnd">Phường, xã:</label>
                      <select
                        class="form-select"
                        id="wards"
                        aria-label="Floating label select example"
                        onChange={handleWard}
                      >
                        <option selected></option>
                        {wards.map((w) => {
                          return (
                            <option key={w.WardID} value={w.WardID}>
                              {w.WardName}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div class="col-md-12">
                      <br />
                      <select
                        class="form-select"
                        id="floatingSelect1"
                        aria-label="Floating label select example"
                      >
                        <option selected>Mời bạn chọn địa chỉ cửa hàng</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </select>
                    </div>
                    <div class="col-md-12">
                      <input
                        hidden
                        id="floatingSelect2"
                        class="form-control"
                        type="text"
                        placeholder="Địa chỉ cụ thể"
                        aria-label="default input example"
                      />
                    </div>
                  </div>
                  <div id="dcmd2" hidden>
                    <br />
                    <label for="kh_cmnd">Mời bạn chọn địa chỉ mặc định:</label>
                    <select
                      class="form-select"
                      id="floatingSelect"
                      aria-label="Floating label select example"
                    >
                      <option selected>Chọn tỉnh, thành phố</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                </div>
                <br />
                <h4 class="mb-3">Hình thức thanh toán</h4>
                <div class="d-block my-3">
                  <div class="custom-control custom-radio">
                    <input
                      id="httt-1"
                      name="httt_ma"
                      type="radio"
                      class="custom-control-input"
                      required=""
                      value="1"
                      checked={isChecked}
                      onChange={datHang}
                    />
                    <label class="custom-control-label" for="httt-1">
                      Tiền mặt
                    </label>
                  </div>
                  <div class="custom-control custom-radio">
                    <input
                      id="httt-2"
                      name="httt_ma"
                      type="radio"
                      class="custom-control-input"
                      required=""
                      value="2"
                      checked={!isChecked}
                      onChange={datHang}
                    />
                    <label class="custom-control-label" for="httt-2">
                      VN Pay
                    </label>
                  </div>
                  <hr class="mb-4" />
                  {/*<Link to={linkPay}>*/}
                  <button
                    class="btn btn-primary btn-lg btn-block"
                    // type="submit"
                    name="btnDatHang"
                    type="submit"
                  >
                    Đặt hàng
                  </button>
                  {/*</Link>*/}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />

      <Modal
        visible={isModalVisible}
        onCancel={handleCancel}
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
            <p style={{ marginTop: "10px" }}>Mã FreeShip</p>
            <div
              className="card-body"
              data-mdb-perfect-scrollbar="true"
              style={{ position: "relative", height: 200, overflowY: "auto" }}
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
                      {/* <Checkbox
                        onClick={() => handleVoucherClick(voucher)}
                      /> */}
                      <Button
                        type="text"
                        danger
                        onClick={() => handleVoucherFreeShipClick(voucher)}
                      >
                        Áp dụng
                      </Button>
                      <br />
                      <Button
                        type="text"
                        danger
                        onClick={() => handleClearVoucherFreeShip(voucher.id)}
                      >
                        Hủy
                      </Button>
                    </strong>
                  </li>
                </ul>
              ))}
            </div>
            <p style={{ marginTop: "10px" }}>Mã Giảm giá</p>
            <div
              className="card-body"
              data-mdb-perfect-scrollbar="true"
              style={{ position: "relative", height: 330, overflowY: "auto" }}
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
                      <Button
                        type="text"
                        danger
                        onClick={() => handleVoucherClick(voucher)}
                      >
                        Áp dụng
                      </Button>
                      <br />
                      <Button
                        type="text"
                        danger
                        onClick={() => handleClearVoucher(voucher.id)}
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
  );
};

export default Checkout;
