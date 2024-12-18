# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
FROM node:22 as chroot

RUN apt-get update && apt-get install -y socat

WORKDIR /usr/src/app

COPY . .
RUN npm ci --ignore-scripts
ENV FLAG=squ1rrel{7h0ugh7_y0u_c0u1d_regex_y0ur_way_0u7_0f_7h1s_ay3?}

CMD (node startup.js) \
    && (node index.js)