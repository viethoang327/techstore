import * as React from "react";
import "../Checkout/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {useEffect} from "react";
import Header from "../../Page_Comeponet/layout/Header";
import Footer from "../../Page_Comeponet/layout/Footer";
import {useState} from "react";
import {readAll} from "../../../service/cart.service";
import {readQuantityInCart} from "../../../service/cart.service";
import {GiftOutlined} from "@ant-design/icons";
import {Image, Checkbox, Modal, notification, Button, Input} from "antd";
import {getVoucher, getVoucherFreeShip} from "../../../service/Voucher/voucher.service";
import {getPay} from "../../../service/Vnpay/vnpay.service";
import {createBill} from "../../../service/Bill/bill.service";

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
    const [linkPay, setLinkPay] = useState(["/login"]);
    const [isChecked, setIsChecked] = useState([true]);
    const [voucherFreeShip, setVoucherFreeShip] = useState([true]);
    const [selecteVoucherFreeShip, setSelectedVoucherFreeShip] = useState(0);
    const [billAsk, setBillAsk] = useState([]);
    const [bill, setBill] = useState({
        userName: "",
        phoneNumber: "",
        email: "",
        address: "",
        province: "",
        district: "",
        itemDiscount: 0,
        totalMoney: 0,
        paymentMethod: isChecked ? "TIEN_MAT" : "CHUYEN_KHOAN",
        billDetail: [],
        wards: ""
    });
    const form = new FormData();

    useEffect(() => {
        //hiển thị giỏ hàng
        readAll(1)
            .then((response) => {
                const data = response.data;
                setProducts(data);
                const list = [];
                data.map((item) => {
                    const obj = {
                        idProductDetail: item.idProduct,
                        price: item.price,
                        quantity: item.quantity
                    }
                    list.push(obj)
                })
                setBill({
                    ...bill,
                    billDetail: list
                })
            })
            .catch((error) => {
                console.log(`${error}`);
            });
        //số lượng sản phẩm tỏng giỏ hàng
        readQuantityInCart(1)
            .then((response) => {
                setQuantity(response.data);
            })
            .catch((error) => {
                console.log(`${error}`);
            });
        //lấy danh sách voucher
        getVoucher()
            .then((response) => {
                setVoucher(response.data);
            })
            .catch((error) => {
                console.log(`${error}`);
            });
        //lấy danh sách voucher
        getVoucherFreeShip()
            .then((response) => {
                setVoucherFreeShip(response.data);
            })
            .catch((error) => {
                console.log(`${error}`);
            });

    }, [isLogin]);

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
    }, [products]);
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

        setBill({
            ...bill,
            totalMoney: total
        })
        //tính phí ship
        let priceS = 0;
        if (total <= 20000000) {
            priceS = 30000;
        } else if (total > 20000000 && total <= 60000000) {
            priceS = 40000;
        } else if (total > 60000000 && total <= 100000000) {
            priceS = 60000;
        } else if (total > 100000000) {
            priceS = 80000;
        }
        setPriceShip(priceS);
        //tính số tiền cẩn thanh toán
        let price = 0;

        if (selecteVoucherFreeShip && selecteVoucher) {
            const voucherValue = parseFloat(selecteVoucher.valueVoucher);
            const voucherVoucherFree = parseFloat(selecteVoucherFreeShip.valueVoucher);
            price = total + priceS - (voucherValue + voucherVoucherFree);
        } else if (selecteVoucher) {

            // Nếu selectedVoucher có giá trị, sử dụng giá trị voucher
            const voucherValue = parseFloat(selecteVoucher.valueVoucher);
            price = total + priceS - voucherValue;
        } else if (selecteVoucherFreeShip) {
            // Nếu chỉ có selectedVoucherFreeShip có giá trị, sử dụng giá trị voucherfreeship
            const voucherVoucherFree = parseFloat(selecteVoucherFreeShip.valueVoucher);
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
        if (totalPrice < voucher.valueMinimum || totalPrice > voucher.valueMaximum) {
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
    }

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
            setLinkPay("/login");
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

    function handleCity(event) {
        setBill({
            ...bill,
            address: event.target.value
        });
    }

    function handleName(event) {
        setBill({
            ...bill,
            userName: event.target.value
        });
    }

    function handlePhone(event) {
        setBill({
            ...bill,
            phoneNumber: event.target.value
        });
    }

    function handleMail(event) {
        setBill({
            ...bill,
            email: event.target.value
        });
    }

    function handleDistrict(event) {
        setBill({
            ...bill,
            district: event.target.value
        });
    }

    function handleStore(event) {
        event.preventDefault();
        console.log(bill)
    }

    function handleSubmit() {
        createBill(bill).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <>
            <Header/>
            <button onClick={() => test()}>test</button>
            <main role="main">
                <div class="container mt-4">
                    <form
                        class="needs-validation"
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
                                                    {product.nameProduct} {product.capacity} {product.color}
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
                                            <GiftOutlined onClick={() => handleEditClick()}/>
                                        </strong>
                                    </li>
                                </ul>
                                <div className="d-flex justify-content-between px-x">
                                    <p className="fw-bold">
                                        Giảm giá Voucher:
                                    </p>
                                    <p className="fw-bold">
                                        -{(selecteVoucher && selecteVoucher.valueVoucher) ?
                                        selecteVoucher?.valueVoucher?.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }) :
                                        0?.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND"
                                        })}</p>
                                </div>
                                <div className="d-flex justify-content-between px-x">
                                    <p className="fw-bold">Tiền vận chuyển:</p>
                                    <p className="fw-bold">
                                        {priceShip?.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between px-x">
                                    <p className="fw-bold">Giảm giá tiền vận chuyển:</p>
                                    <p className="fw-bold">
                                        -{(selecteVoucherFreeShip && selecteVoucherFreeShip.valueVoucher) ?
                                        selecteVoucherFreeShip?.valueVoucher?.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }) :
                                        0?.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND"
                                        })}
                                    </p>
                                </div>
                                <div className="d-flex justify-content-between p-2 mb-2"
                                     style={{backgroundColor: "#e1f5fe"}}>
                                    <h5 className="fw-bold mb-0">THANH TOÁN:</h5>
                                    <h5 className="fw-bold mb-0" style={{color: "red"}}>
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
                                            onChange={handleName}
                                            name="userName"
                                        ></input>
                                        <br/>
                                    </div>
                                    <div className="row">
                                        <div class="col-md-6">
                                            <input
                                                type="text"
                                                class="form-control"
                                                placeholder="Số điện thoại"
                                                onChange={handlePhone}
                                                name="phoneNumber"
                                            ></input>
                                        </div>
                                        <div class="col-md-6">
                                            <input
                                                type="email"
                                                class="form-control"
                                                placeholder="Email"
                                                onChange={handleMail}
                                                name="email"
                                            ></input>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <br/>
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
                                        <div class="col-md-6">
                                            <br/>
                                            <label for="kh_cmnd">Tỉnh, thành phố:</label>
                                            <select
                                                class="form-select"
                                                id="floatingSelect"
                                                aria-label="Floating label select example"
                                                onChange={handleCity}
                                            >
                                                <option selected>Chọn tỉnh, thành phố</option>
                                                <option value="Lục Ngạn">Lục Ngạn</option>
                                                <option value="Đồng tâm">Đồng tâm</option>
                                                <option value="Bắc Lý">Bắc Lý</option>
                                            </select>
                                        </div>
                                        <div class="col-md-6">
                                            <br/>
                                            <label for="kh_cmnd">Quận, huyện:</label>
                                            <select
                                                class="form-select"
                                                id="floatingSelect"
                                                aria-label="Floating label select example"
                                                onChange={handleDistrict}
                                            >
                                                <option selected>Chọn quận, huyện</option>
                                                <option value="Hiệp Hòa">Hiệp Hòa</option>
                                                <option value="Thị trấn Thắng">Thị trấn Thắng</option>
                                                <option value="Châu Minh">Châu Minh</option>
                                            </select>
                                        </div>
                                        <div class="col-md-12">
                                            <br/>
                                            <select
                                                class="form-select"
                                                id="floatingSelect1"
                                                aria-label="Floating label select example"
                                                onChange={handleStore}
                                            >
                                                <option selected>Mời bạn chọn địa chỉ cửa hàng</option>
                                                <option value="Hà Nội">Hà Nội</option>
                                                <option value="Bắc Giang">Bắc Giang</option>
                                                <option value="Thái Nguyên">Thái Nguyên</option>
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
                                        <br/>
                                        <label for="kh_cmnd">Mời bạn chọn địa chỉ mặc định:</label>
                                        <select
                                            class="form-select"
                                            id="floatingSelect"
                                            aria-label="Floating label select example"
                                        >
                                            <option selected>Chọn tỉnh, thành phố</option>
                                            <option value="Lục Ngạn">Lục Ngạn</option>
                                            <option value="Đồng tâm">Đồng tâm</option>
                                            <option value="Bắc Lý">Bắc Lý</option>
                                        </select>
                                    </div>
                                </div>
                                <br/>
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
                                    <hr class="mb-4"/>
                                    {/*<a href={linkPay}>*/}
                                    <button
                                        class="btn btn-primary btn-lg btn-block"
                                        // type="submit"
                                        name="btnDatHang"
                                        type="submit"
                                    >
                                        Đặt hàng
                                    </button>
                                    {/*</a>*/}
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
            <Footer/>

            <Modal
                visible={isModalVisible}
                onCancel={handleCancel}
                width={550}
                footer={null}
                bodyStyle={{minHeight: "700px"}}
            >
                <div className="container py-5">
                    <div className="row d-flex justify-content-center">
                        {/* <div className="card"> */}
                        <div
                            className="card-header d-flex justify-content-between align-items-center p-3"
                            style={{borderTop: "4px solid #ffa900"}}
                        >
                            <h5 className="mb-0">VOUCHER CỦA SHOP</h5>
                        </div>
                        <p style={{marginTop: "10px"}}>Mã FreeShip</p>
                        <div
                            className="card-body"
                            data-mdb-perfect-scrollbar="true"
                            style={{position: "relative", height: 200, overflowY: 'auto'}}
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
                                            <Button type="text" danger
                                                    onClick={() => handleVoucherFreeShipClick(voucher)}>
                                                Áp dụng
                                            </Button>
                                            <br/>
                                            <Button type="text" danger
                                                    onClick={() => handleClearVoucherFreeShip(voucher.id)}>
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
                            style={{position: "relative", height: 330, overflowY: 'auto'}}
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
                                        <span style={{paddingLeft: "10px"}}>
                      {voucher.name}
                                            <br/>
                      <p style={{color: "red", fontSize: "15px"}}>
                        Giảm{" "}
                          {voucher?.valueVoucher?.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                          })}
                      </p>
                      <p>
                        Đơn giá trị tối thiểu {voucher.valueMinimum}
                          <br/>
                        Đơn giá trị tối đa {voucher.valueMaximum}
                      </p>
                    </span>
                                        <strong>
                                            <Button type="text" danger onClick={() => handleVoucherClick(voucher)}>
                                                Áp dụng
                                            </Button>
                                            <br/>
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
    )
        ;
};

export default Checkout;
