import React, {useEffect, useState} from 'react';
import Header from "../../Page_Comeponet/layout/Header";
import Footer from "../../Page_Comeponet/layout/Footer";
import {Button, Tag} from 'antd';
import {RightOutlined} from "@ant-design/icons";
import {Link} from "react-router-dom/cjs/react-router-dom.min";
import CapacityOfProduct from "./capacity/CapacityOfProduct";
import ColorOfProduct from "./color/ColorOfProduct";
import {useParams} from "react-router-dom/cjs/react-router-dom";
import {findProductById} from "../../../service/product.service";
import AvtProduct from "../avtProduct";

export default function ProductDetail() {

    const VND = new Intl.NumberFormat('vn-VN', {
        style: 'currency',
        currency: 'VND'
    });

    const [product, setProduct] = useState({});
    const { id } = useParams();

    useEffect(() => {
        findProductById(id).then((response) => {
            setProduct(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    const [selectedDungLuong, setSelectedDungLuong] = useState(null);

    const [selectedMauSac, setSelectedMauSac] = useState(null);

    return (
        <React.Fragment>
            <Header/>
            <section>
                <div className="breadcrumbs_area">
                    <div className="row" style={{marginTop: "10px"}}>
                        <div id="detailPromo">
                            <Link to={"/"}>Home</Link>
                            <RightOutlined/>
                            <Link to={"/singleProduct"}>Singer Product</Link>
                        </div>
                    </div>
                </div>
                <div className="chitietSanpham" style={{marginBottom: 100}}>
                    <h1>{product.name}</h1>
                    <div className="rating">
                        <i className="fa fa-star"/>
                        <i className="fa fa-star"/>
                        <i className="fa fa-star"/>
                        <i className="fa fa-star"/>
                        <i className="fa fa-star-o"/>
                        <span> 372 đánh giá</span>
                    </div>
                    <div className="rowdetail group">
                        <AvtProduct product={product.id}></AvtProduct>
                        <div className="price_sale">
                            <div className="area_price">
                                <strong>{VND.format(product.price)}</strong>
                                <label className="moiramat">Mới ra mắt</label>
                            </div>
                            <CapacityOfProduct product={id} capacities={selectedDungLuong} setCapacities={setSelectedDungLuong}></CapacityOfProduct>
                            <ColorOfProduct product={id} colors={selectedMauSac} setColors={setSelectedMauSac}></ColorOfProduct>
                            {/* </div> */}
                            <div className="area_promo">
                                <strong>khuyến mãi</strong>
                                <div className="promo">
                                    <img src="img/chitietsanpham/icon-tick.png"/>
                                    <div id="detailPromo">
                                        Khách hàng sẽ được thử máy miễn phí tại cửa hàng. Có thể đổi trả lỗi
                                        trong vòng 2 tháng.
                                    </div>
                                </div>
                            </div>
                            <div className="policy">
                                <div>
                                    <img src="img/chitietsanpham/box.png"/>
                                    <p>
                                        Trong hộp có: Sạc, Tai nghe, Sách hướng dẫn, Cây lấy sim, Ốp lưng{" "}
                                    </p>
                                </div>
                                <div>
                                    <img src="img/chitietsanpham/icon-baohanh.png"/>
                                    <p>Bảo hành chính hãng 12 tháng.</p>
                                </div>
                                <div className="last">
                                    <img src="img/chitietsanpham/1-1.jpg"/>
                                    <p>
                                        1 đổi 1 trong 1 tháng nếu lỗi, đổi sản phẩm tại nhà trong 1 ngày.
                                    </p>
                                </div>
                            </div>
                            <div className="area_order">
                                {/* nameProduct là biến toàn cục được khởi tạo giá trị trong phanTich_URL_chiTietSanPham */}
                                <a
                                    className="buy_now"
                                    onclick="themVaoGioHang(maProduct, nameProduct);"
                                >
                                    <b>
                                        <i className="fa fa-cart-plus"/> Thêm vào giỏ hàng
                                    </b>
                                    <p>Giao trong 1 giờ hoặc nhận tại cửa hàng</p>
                                </a>
                            </div>
                        </div>
                        <div className="info_product">
                            <h2>Thông số kỹ thuật</h2>
                            <ul className="info">
                                <li>
                                    <p>Màn hình</p>
                                    <div>IPS LCD, 5.99', Full HD+</div>
                                </li>
                                <li>
                                    <p>Hệ điều hành</p>
                                    <div>Android 8.1 (Oreo)</div>
                                </li>
                                <li>
                                    <p>Camara sau</p>
                                    <div>12 MP và 5 MP (2 camera)</div>
                                </li>
                                <li>
                                    <p>Camara trước</p>
                                    <div>13 MP</div>
                                </li>
                                <li>
                                    <p>CPU</p>
                                    <div>Qualcomm Snapdragon 636 8 nhân</div>
                                </li>
                                <li>
                                    <p>RAM</p>
                                    <div>4 GB</div>
                                </li>
                                <li>
                                    <p>Bộ nhớ trong</p>
                                    <div>64 GB</div>
                                </li>
                                <li>
                                    <p>Thẻ nhớ</p>
                                    <div>MicroSD, hỗ trợ tối đa 128 GB</div>
                                </li>
                                <li>
                                    <p>Dung lượng pin</p>
                                    <div>4000 mAh, có sạc nhanh</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div id="overlaycertainimg" className="overlaycertainimg">
                        <div className="close" onclick="closecertain()">
                            ×
                        </div>
                        <div className="overlaycertainimg-content">
                            <img
                                id="bigimg"
                                className="bigimg"
                                src="img/products/xiaomi-redmi-note-5-pro-600x600.jpg"
                            />
                            <div className="div_smallimg owl-carousel owl-loaded owl-drag">
                                {/* <img src="img/chitietsanpham/oppo-f9-mau-do-1-org.jpg" onclick="changepic(this.src)">
                          <img src="img/chitietsanpham/oppo-f9-mau-do-2-org.jpg" onclick="changepic(this.src)">
                          <img src="img/chitietsanpham/oppo-f9-mau-do-3-org.jpg" onclick="changepic(this.src)"> */}
                                <div className="owl-stage-outer">
                                    <div
                                        className="owl-stage"
                                        style={{
                                            transition: "all 0s ease 0s",
                                            width: 2135,
                                            transform: "translate3d(610px, 0px, 0px)"
                                        }}
                                    >
                                        <div
                                            className="owl-item active center"
                                            style={{width: "304.96px"}}
                                        >
                                            <div className="item">
                                                <a>
                                                    <img
                                                        src="img/products/huawei-mate-20-pro-green-600x600.jpg"
                                                        onclick="changepic(this.src)"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="owl-item active" style={{width: "304.96px"}}>
                                            <div className="item">
                                                <a>
                                                    <img
                                                        src="img/chitietsanpham/oppo-f9-mau-do-1-org.jpg"
                                                        onclick="changepic(this.src)"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="owl-item active" style={{width: "304.96px"}}>
                                            <div className="item">
                                                <a>
                                                    <img
                                                        src="img/chitietsanpham/oppo-f9-mau-do-2-org.jpg"
                                                        onclick="changepic(this.src)"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="owl-item" style={{width: "304.96px"}}>
                                            <div className="item">
                                                <a>
                                                    <img
                                                        src="img/chitietsanpham/oppo-f9-mau-do-3-org.jpg"
                                                        onclick="changepic(this.src)"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="owl-item" style={{width: "304.96px"}}>
                                            <div className="item">
                                                <a>
                                                    <img
                                                        src="img/products/huawei-mate-20-pro-green-600x600.jpg"
                                                        onclick="changepic(this.src)"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="owl-item" style={{width: "304.96px"}}>
                                            <div className="item">
                                                <a>
                                                    <img
                                                        src="img/chitietsanpham/oppo-f9-mau-do-3-org.jpg"
                                                        onclick="changepic(this.src)"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="owl-item" style={{width: "304.96px"}}>
                                            <div className="item">
                                                <a>
                                                    <img
                                                        src="img/products/huawei-mate-20-pro-green-600x600.jpg"
                                                        onclick="changepic(this.src)"
                                                    />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="owl-nav disabled">
                                    <button type="button" role="presentation" className="owl-prev">
                                        <span aria-label="Previous">‹</span>
                                    </button>
                                    <button type="button" role="presentation" className="owl-next">
                                        <span aria-label="Next">›</span>
                                    </button>
                                </div>
                                <div className="owl-dots">
                                    <button role="button" className="owl-dot active">
                                        <span/>
                                    </button>
                                    <button role="button" className="owl-dot">
                                        <span/>
                                    </button>
                                    <button role="button" className="owl-dot">
                                        <span/>
                                    </button>
                                    <button role="button" className="owl-dot">
                                        <span/>
                                    </button>
                                    <button role="button" className="owl-dot">
                                        <span/>
                                    </button>
                                    <button role="button" className="owl-dot">
                                        <span/>
                                    </button>
                                    <button role="button" className="owl-dot">
                                        <span/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* hien thi san pham           */}
                <div id="goiYSanPham">
                    <div className="khungSanPham" style={{borderColor: "#434aa8"}}>
                        <h3
                            className="tenKhung"
                            style={{
                                backgroundImage:
                                    "linear-gradient(120deg, #434aa8 0%, #ec1f1f 50%, #434aa8 100%)"
                            }}
                        >
                            * Bạn có thể thích *
                        </h3>
                        <div className="listSpTrongKhung flexContain">
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Xiaomi-Redmi-5-Plus-4GB">
                                    <img src="img/products/xiaomi-redmi-5-plus-600x600.jpg" alt=""/>
                                    <h3>Xiaomi Redmi 5 Plus 4GB</h3>
                                    <div className="price">
                                        <strong>4.790.000₫</strong>
                                    </div>
                                    <div className="ratingresult">
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star-o"/>
                                        <span>347 đánh giá</span>
                                    </div>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Xia3', 'Xiaomi Redmi 5 Plus 4GB'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Realme-2-Pro-4GB/64GB">
                                    <img
                                        src="https://cdn.tgdd.vn/Products/Images/42/193464/realme-2-pro-4gb-64gb-blue-600x600.jpg"
                                        alt=""
                                    />
                                    <h3>Realme 2 Pro 4GB/64GB</h3>
                                    <div className="price">
                                        <strong>5.590.000₫</strong>
                                    </div>
                                    <div className="ratingresult">
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star-o"/>
                                        <span>11 đánh giá</span>
                                    </div>
                                    <label className="moiramat">Mới ra mắt</label>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Rea3', 'Realme 2 Pro 4GB/64GB'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Nokia-5.1-Plus">
                                    <img
                                        src="img/products/nokia-51-plus-black-18thangbh-400x400.jpg"
                                        alt=""
                                    />
                                    <h3>Nokia 5.1 Plus</h3>
                                    <div className="price">
                                        <strong>4.790.000₫</strong>
                                    </div>
                                    <div className="ratingresult">
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <span>7 đánh giá</span>
                                    </div>
                                    <label className="giamgia">
                                        <i className="fa fa-bolt"/> Giảm 250.000₫
                                    </label>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Nok0', 'Nokia 5.1 Plus'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Vivo-Y85">
                                    <img
                                        src="https://cdn.tgdd.vn/Products/Images/42/156205/vivo-y85-red-docquyen-600x600.jpg"
                                        alt=""
                                    />
                                    <h3>Vivo Y85</h3>
                                    <div className="price">
                                        <strong>4.990.000₫</strong>
                                    </div>
                                    <div className="ratingresult">
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star-o"/>
                                        <span>60 đánh giá</span>
                                    </div>
                                    <label className="giamgia">
                                        <i className="fa fa-bolt"/> Giảm 500.000₫
                                    </label>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Viv2', 'Vivo Y85'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?HTC-U12-life">
                                    <img
                                        src="https://cdn.tgdd.vn/Products/Images/42/186397/htc-u12-life-1-600x600.jpg"
                                        alt=""
                                    />
                                    <h3>HTC U12 life</h3>
                                    <div className="price">
                                        <strong>7.690.000₫</strong>
                                    </div>
                                    <div className="ratingresult">
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star-o"/>
                                        <span>12 đánh giá</span>
                                    </div>
                                    <label className="moiramat">Mới ra mắt</label>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('HTC0', 'HTC U12 life'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Samsung-Galaxy-J8">
                                    <img
                                        src="img/products/samsung-galaxy-j8-600x600-600x600.jpg"
                                        alt=""
                                    />
                                    <h3>Samsung Galaxy J8</h3>
                                    <div className="price">
                                        <strong>6.290.000₫</strong>
                                    </div>
                                    <div className="ratingresult"></div>
                                    <label className="giamgia">
                                        <i className="fa fa-bolt"/> Giảm 500.000₫
                                    </label>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Sam2', 'Samsung Galaxy J8'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Xiaomi-Mi-8-Lite">
                                    <img src="img/products/xiaomi-mi-8-lite-black-1-600x600.jpg" alt=""/>
                                    <h3>Xiaomi Mi 8 Lite</h3>
                                    <div className="price">
                                        <strong>6.690.000₫</strong>
                                    </div>
                                    <div className="ratingresult"></div>
                                    <label className="tragop">Trả góp 0%</label>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Xia0', 'Xiaomi Mi 8 Lite'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Xiaomi-Mi-8">
                                    <img src="img/products/xiaomi-mi-8-1-600x600.jpg" alt=""/>
                                    <h3>Xiaomi Mi 8</h3>
                                    <div className="price">
                                        <strong>12.990.000₫</strong>
                                    </div>
                                    <div className="ratingresult"></div>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Xia1', 'Xiaomi Mi 8'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Realme-2-4GB/64GB">
                                    <img
                                        src="https://cdn.tgdd.vn/Products/Images/42/193462/realme-2-4gb-64gb-docquyen-600x600.jpg"
                                        alt=""
                                    />
                                    <h3>Realme 2 4GB/64GB</h3>
                                    <div className="price">
                                        <strong>4.490.000₫</strong>
                                    </div>
                                    <div className="ratingresult">
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <span>7 đánh giá</span>
                                    </div>
                                    <label className="moiramat">Mới ra mắt</label>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Rea1', 'Realme 2 4GB/64GB'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                            <li className="sanPham">
                                <a href="chitietsanpham.html?Mobiistar-Zumbo-S2-Dual">
                                    <img src="img/products/mobiistar-zumbo-s2-dual-300x300.jpg" alt=""/>
                                    <h3>Mobiistar Zumbo S2 Dual</h3>
                                    <div className="price">
                                        <strong>2.850.000₫</strong>
                                    </div>
                                    <div className="ratingresult">
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star"/>
                                        <i className="fa fa-star-o"/>
                                        <span>104 đánh giá</span>
                                    </div>
                                    <label className="moiramat">Mới ra mắt</label>
                                    <div className="tooltip">
                                        <button
                                            className="themvaogio"
                                            onclick="themVaoGioHang('Mob1', 'Mobiistar Zumbo S2 Dual'); return false;"
                                        >
                      <span className="tooltiptext" style={{fontSize: 15}}>
                        Thêm vào giỏ
                      </span>
                                            +
                                        </button>
                                    </div>
                                </a>
                            </li>
                        </div>
                    </div>
                </div>

            </section>
            <Footer/>
        </React.Fragment>
    );
}