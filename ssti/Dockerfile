FROM python:3.8-slim as chroot

RUN apt-get update && apt-get install -y socat

WORKDIR /usr/src/app

COPY . .
RUN pip install -r requirements.txt
ENV FLAG=squ1rrel{g37_1nj3c73d_l0l}

EXPOSE 8082

# Define the command to run your app
CMD ["flask", "run", "--host=0.0.0.0", "--port=8082"]

# docker run -p 8082:8082 cshs/ssti