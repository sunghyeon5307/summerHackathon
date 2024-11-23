import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./style.css";

const Modal = ({ closeChatModal, spid, startListening }) => {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const recognitionInstance = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognitionInstance.lang = 'ko-KR';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        if (transcript.includes('멈춰')) { // 음성 인식 결과에 '멈춰'가 포함되면 인식 중지
          recognitionInstance.stop();
        }
      };

      setRecognition(recognitionInstance);
      if (startListening) {
        recognitionInstance.start();
      }

      return () => {
        recognitionInstance.stop(); // 컴포넌트가 언마운트되면 음성 인식 중지
      };
    } else {
      alert('Web Speech API가 지원되지 않는 브라우저입니다.');
    }
  }, [startListening]);

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
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{transcript}</p>
        </div>
      </div>
    </div>
  );
};

const Navi = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [spid, setSpid] = useState(100);
  const [data, setData] = useState(null);
  const [startListening, setStartListening] = useState(true); 

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
  }, []);

  const showChatModal = async () => {
    setSpid(190);
    setVisible(true);
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
      {visible && <Modal closeChatModal={closeChatModal} spid={spid} startListening={startListening} />}
      <div></div>
    </div>
  );
};

export default Navi;
