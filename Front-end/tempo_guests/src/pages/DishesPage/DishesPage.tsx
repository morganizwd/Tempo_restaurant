import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import {
  BoxArrowRight,
  Cart3,
  Clock,
  GeoAlt,
  Telephone,
} from "react-bootstrap-icons";
import { IKImage } from "imagekitio-react";
import "./DishesPage.scss";
import { useGlobalStore } from "../../shared/state/globalStore";
import CategoryModule from "../../modules/CategoryModule/CategoryModule";
import { useNavigate } from "react-router-dom";

const promoCards = [
  {
    title: "\u0421\u044b\u0440\u044b\u0435 \u043f\u0430\u043b\u043e\u0447\u043a\u0438",
    subtitle: "\u043f\u043e \u043e\u043f\u0442\u043e\u0432\u043e\u0439 \u0446\u0435\u043d\u0435",
    tag: "-50%",
    tone: "sunset",
  },
  {
    title: "\u041f\u043e\u0434\u0430\u0440\u043e\u043a \u043a \u043a\u043e\u043c\u0431\u043e",
    subtitle: "\u043f\u0440\u0438 \u0437\u0430\u043a\u0430\u0437\u0435 \u043e\u0442 800 \u0440\u0443\u0431.",
    tag: "\u0421\u043b\u0430\u0434\u043a\u0438\u0439 \u0431\u043e\u043d\u0443\u0441",
    tone: "peach",
  },
  {
    title: "\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0443\u0439 \u043d\u0430\u0441 \u0434\u0440\u0443\u0437\u044c\u044f\u043c",
    subtitle: "\u0438 \u043f\u043e\u043b\u0443\u0447\u0430\u0439 \u0440\u043e\u043b\u043b\u044b",
    tag: "\u0420\u0435\u0444\u0435\u0440\u0430\u043b",
    tone: "spicy",
  },
  {
    title: "\u0414\u0430\u0440\u0438\u043c \u0441\u043a\u0438\u0434\u043a\u0443 10%",
    subtitle: "\u043d\u0430 \u043f\u0435\u0440\u0432\u044b\u0435 \u0437\u0430\u043a\u0430\u0437\u044b",
    tag: "\u041f\u0440\u043e\u043c\u043e\u043a\u043e\u0434 START",
    tone: "cream",
  },
];

const DishesPage = () => {
  const { menu, fetchMenu, currentUser, logout } = useGlobalStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Container fluid className="Container dishes-page">
      <div id="content">
        <div className="dishes-wallpaper">
          <div className="menu-board">
            <div className="board-nav">
              <div className="nav-brand" onClick={() => scrollTo("hero")}>
                <span className="brand-mark">Tempo</span>
              </div>
              <div className="nav-links">
                <button type="button" onClick={() => scrollTo("categories")}>
                  {"\u041c\u0435\u043d\u044e"}
                </button>
                <button type="button" onClick={() => scrollTo("promos")}>
                  {"\u0410\u043a\u0446\u0438\u0438"}
                </button>
                <button type="button" onClick={() => scrollTo("hero")}>
                  {"\u041e \u043d\u0430\u0441"}
                </button>
                <button type="button" onClick={() => scrollTo("popular")}>
                  {"\u041e\u0442\u0437\u044b\u0432\u044b"}
                </button>
              </div>
              <div className="nav-actions">
                {currentUser && (
                  <div
                    className="nav-user"
                    onClick={() => navigate("/cart")}
                    role="button"
                  >
                    {currentUser.name}
                  </div>
                )}
                <Button
                  variant="link"
                  className="nav-icon"
                  onClick={() => navigate("/cart")}
                  aria-label="\u041e\u0442\u043a\u0440\u044b\u0442\u044c \u043a\u043e\u0440\u0437\u0438\u043d\u0443"
                >
                  <Cart3 />
                </Button>
                {currentUser && (
                  <Button
                    variant="link"
                    className="nav-icon"
                    onClick={() => {
                      logout();
                      navigate("/login");
                    }}
                    aria-label="\u0412\u044b\u0439\u0442\u0438"
                  >
                    <BoxArrowRight />
                  </Button>
                )}
              </div>
            </div>

            <div className="hero-section" id="hero">
              <h1 className="hero-logo">TEMPO</h1>
              <div className="hero-info">
                <div className="info-item">
                  <Clock className="info-icon" />
                  <div>
                    <div className="info-label">
                      {"\u0412\u0440\u0435\u043c\u044f \u0440\u0430\u0431\u043e\u0442\u044b"}
                    </div>
                    <div className="info-value">10:00 - 22:00</div>
                  </div>
                </div>
                <div className="info-item">
                  <GeoAlt className="info-icon" />
                  <div>
                    <div className="info-label">{"\u0410\u0434\u0440\u0435\u0441"}</div>
                    <div className="info-value">
                      {
                        "\u0421\u0430\u043d\u043a\u0442-\u041f\u0435\u0442\u0435\u0440\u0431\u0443\u0440\u0433, \u043f\u043b\u043e\u0449\u0430\u0434\u044c \u0412\u043e\u0441\u0441\u0442\u0430\u043d\u0438\u044f, \u0443\u043b. \u0416\u0443\u043a\u043e\u0432\u0441\u043a\u043e\u0433\u043e 3\u0411"
                      }
                    </div>
                  </div>
                </div>
                <div className="info-item">
                  <Telephone className="info-icon" />
                  <div>
                    <div className="info-label">{"\u0422\u0435\u043b\u0435\u0444\u043e\u043d"}</div>
                    <div className="info-value">+7 467 983 45 57</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="promo-strip" aria-hidden="true">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={`promo-top-${i}`}>{"\u0410\u041a\u0426\u0418\u0418!"}</span>
              ))}
            </div>
            <div className="promo-gallery" id="promos">
              {promoCards.map((promo) => (
                <div key={promo.title} className={`promo-card ${promo.tone}`}>
                  <span className="promo-tag">{promo.tag}</span>
                  <h3>{promo.title}</h3>
                  <p>{promo.subtitle}</p>
                </div>
              ))}
            </div>

            <div className="categories-section" id="categories">
              <div className="section-divider">
                <span>{"<"}</span>
                <h2 className="section-title">{"\u041a\u0430\u0442\u0435\u0433\u043e\u0440\u0438\u0438"}</h2>
                <span>{">"}</span>
              </div>
              <div className="categories-grid">
                {menu.map((category, i) => {
                  const previewImage =
                    category.dishes[0]?.photo || category.drinks[0]?.photo;
                  return (
                    <div key={`${category.name}-${i}`} className="category-card">
                      {previewImage && (
                        <div className="category-image-wrapper">
                          <IKImage
                            path={previewImage}
                            className="category-image"
                            transformation={[
                              { width: 500, height: 400, crop: "fill" },
                            ]}
                          />
                        </div>
                      )}
                      <Button
                        variant="primary"
                        className="category-button"
                        onClick={() =>
                          document
                            .getElementById(`category-${i}`)
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        {category.name}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="popular-strip" id="popular" aria-hidden="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <span key={`popular-${i}`}>{"\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u043e\u0435!"}</span>
              ))}
            </div>

            <div className="menu-groups">
              {menu.map((category, i) => (
                <div key={`${category.name}-${i}`} id={`category-${i}`}>
                  <CategoryModule category={category} />
                </div>
              ))}
            </div>
            
            <div className="cart-button-wrapper">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/cart")}
                className="cart-button"
              >
                <Cart3 size={20} className="me-2" />
                {"\u041f\u0435\u0440\u0435\u0439\u0442\u0438 \u0432 \u043a\u043e\u0440\u0437\u0438\u043d\u0443"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DishesPage;
