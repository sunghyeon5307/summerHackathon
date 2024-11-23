import serial
import time
import mysql.connector
from mysql.connector import pooling
import asyncio
import aiomysql

# MySQL 연결 설정
db_config = {
    'host': 'svc.sel4.cloudtype.app',
    'user': 'root',
    'password': 'bluelemon1!',
    'db': 'CARCAR',  # 'database'를 'db'로 변경
    'port': 32485
}

# 시리얼 포트 설정
ser = serial.Serial('COM3', 9600, timeout=1)
time.sleep(2)  # 아두이노 리셋을 위한 대기 시간

# 연결 풀 생성
connection_pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

def read_arduino_data():
    if ser.in_waiting > 0:
        line = ser.readline().decode('utf-8').rstrip()
        try:
            speed = float(line)
            return speed
        except ValueError:
            print("잘못된 데이터:", line)
            return None
    return None

async def save_to_mysql(speeds):
    try:
        async with aiomysql.create_pool(**db_config) as pool:
            async with pool.acquire() as conn:
                async with conn.cursor() as cur:
                    query = "UPDATE speed_data SET speed = %s WHERE speed_id = 1;"
                    await cur.execute(query, (speeds[-1],))
                    await conn.commit()
        print(f"데이터 저장 완료: {len(speeds)} 개의 데이터")
    except Exception as error:
        print(f"MySQL 오류: {error}")

async def get_from_mysql():
    try:
        async with aiomysql.create_pool(**db_config) as pool:
            async with pool.acquire() as conn:
                async with conn.cursor() as cur:
                    query = "SELECT whyrano FROM Whyrano WHERE whyrano_id = 1;"
                    await cur.execute(query)
                    result = await cur.fetchone()
                    if result:
                        return int(result[0])  # 정수로 변환
    except Exception as error:
        print(f"MySQL 오류: {error}")
    return None

async def get_stop_value_from_mysql():
    try:
        async with aiomysql.create_pool(**db_config) as pool:
            async with pool.acquire() as conn:
                async with conn.cursor() as cur:
                    query = "SELECT stop FROM Stop WHERE stop_id = 1;"
                    await cur.execute(query)
                    result = await cur.fetchone()
                    if result:
                        return int(result[0])  # 정수로 변환
    except Exception as error:
        print(f"MySQL 오류 (stop 테이블): {error}")
    return None

def send_to_arduino(value1, value2):
    ser.write(f"{value1},{value2}\n".encode())
    print(f"아두이노로 전송된 값: value1={value1}, value2={value2}")

async def main():
    speeds = []
    last_save_time = time.time()
    last_get_time = time.time()
    try:
        while True:
            speed = read_arduino_data()
            if speed is not None:
                speeds.append(speed)
                print(f"속도: {speed:.2f} km/h")

            current_time = time.time()
            if current_time - last_save_time >= 1 and speeds:  # 1초마다 저장
                await save_to_mysql(speeds)
                speeds.clear()
                last_save_time = current_time

            if current_time - last_get_time >= 1:  # 1초마다 MySQL에서 데이터 가져오기
                value1 = await get_from_mysql()
                value2 = await get_stop_value_from_mysql()
                if value1 is not None and value2 is not None:
                    send_to_arduino(value1, value2)
                last_get_time = current_time

            await asyncio.sleep(0.1)  # 0.1초 간격으로 데이터 읽기

    except KeyboardInterrupt:
        print("프로그램을 종료합니다.")
    except Exception as e:
        print(f"예외 발생: {e}")
    finally:
        if ser and ser.is_open:
            ser.close()

if __name__ == "__main__":
    asyncio.run(main())

def send_to_arduino(value):
    ser.write(f"{value}\n".encode())
    print(f"아두이노로 전송된 값: {value}")

async def main():
    speeds = []
    last_save_time = time.time()
    last_get_time = time.time()
    try:
        while True:
            speed = read_arduino_data()
            if speed is not None:
                speeds.append(speed)
                print(f"속도: {speed:.2f} km/h")

            current_time = time.time()
            if current_time - last_save_time >= 1 and speeds:  # 1초마다 저장
                await save_to_mysql(speeds)
                speeds.clear()
                last_save_time = current_time

            if current_time - last_get_time >= 1:  # 1초마다 MySQL에서 데이터 가져오기
                value = await get_from_mysql()
                if value is not None:
                    send_to_arduino(value)
                last_get_time = current_time

            await asyncio.sleep(0.1)  # 0.1초 간격으로 데이터 읽기

    except KeyboardInterrupt:
        print("프로그램을 종료합니다.")
    except Exception as e:
        print(f"예외 발생: {e}")
    finally:
        if ser and ser.is_open:
            ser.close()

if __name__ == "__main__":
    asyncio.run(main())