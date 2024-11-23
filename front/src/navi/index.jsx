import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const Modal = ({ closeChatModal, spid }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">주의하세요</div>
        <div className="modal-body">
          <p className="text">
            급발진이 의심됩니다. (현재속도: {spid})<br />
            음성 AI가 활성화 되었습니다. "멈춰"를 외쳐주세요.
          </p>
        </div>

        <button className="close-button" onClick={closeChatModal}>
          닫기
        </button>
      </div>
    </div>
  );
};

const Navi = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [spid, setSpid] = useState(100);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://port-0-speed-data-9zxht12blq9gr7pi.sel4.cloudtype.app/main",
        );
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    // const intervalId = setInterval(fetchData, 100);

    // return () => clearInterval(intervalId);
  }, []);

  const showChatModal = async () => {
    setSpid(190);
    setVisible(true);
    try {
      await axios.post(
        "https://port-0-speed-data-9zxht12blq9gr7pi.sel4.cloudtype.app/main",
        { value: 1 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }

    try {
      await axios.post(
        "https://port-0-speed-data-9zxht12blq9gr7pi.sel4.cloudtype.app/stop",
        { value: 1 },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const closeChatModal = () => {
    setVisible(false);
  };

  const handleClick = () => {
    navigate(`/balgin`);
  };

  return (
    <div id="layout">
      <p id="spid">{visible ? 190 : JSON.stringify(data)} km/h</p>
      <button id="id" onClick={showChatModal}>
        급발진 의심 테스트
      </button>
      <button id="button" onClick={handleClick}>
        전조 증상 알리미
      </button>
      {visible && <Modal closeChatModal={closeChatModal} spid={spid} />}
      <div></div>
    </div>
  );
};

export default Navi;
