import "./style.css";
import { useState } from "react";

const Modal = ({ closeModal }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">주의하세요</div>
        <div className="modal-body">
          <p className="text">
            급발진이 의심됩니다.
            <br />
            음성 AI가 활성화 되었습니다. "멈춰"를 외쳐주세요.
          </p>
        </div>
        <button className="close-button" onClick={closeModal}>
          닫기
        </button>
      </div>
    </div>
  );
};

const Baljin = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => {
    setVisible(true);
  };

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <>
      <div className="layout">
        <div className="header">
          <h1 className="title">전조 증상 알리미</h1>
          <p className="qa" onClick={showModal}>
            궁금해요!
          </p>
        </div>
        {visible && <Modal closeModal={closeModal} />}
      </div>
    </>
  );
};

export default Baljin;
