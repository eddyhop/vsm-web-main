import { rest } from 'msw'
import { loginSuccessPayload, userInfoPayload, plainSuccessResponse, plainSuccessResponseNegated } from '@/mocks/payloads/loginResponse'
import { mobileClientsListResponse, clientConnectionResponse} from "@/mocks/payloads/portsResponse";
import { clientVpnUpAndDownChartResponse, 
  deviceTunnelResponse,
  getByClientVPNStatus,
  getBySiteVPNStatus,
  siteVPNResponse,
  logicalInterfaceResponse,
  getVPNSiteResponse,
  tenantServiceResponse,
  tenantServiceResponse1,
  vpnSiteOptions
} from "@/mocks/payloads/largeResponse";
import { menuList } from './payloads/menuList';

export default [

  rest.post('/vsm/login', (req, res, ctx) => {
    return res(
        ctx.json(loginSuccessPayload)
    )
  }),

  rest.get('/vsm/user/info', (req, res, ctx) => {
    return res(
        ctx.json(userInfoPayload)
    )
  }),
  rest.get('/vsm/tenantService/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json(tenantServiceResponse)
    )
  }),
  rest.get('/vsm/tenantService/options', (req, res, ctx) => {
    return res(
      ctx.json(tenantServiceResponse1)
    )
  }),
  rest.get('/vsm/vpnSite/options', (req, res, ctx) => {
    return res(
      ctx.json(vpnSiteOptions)
    )
  }),
  rest.get('/vsm/logical/options', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1678958191202,
        "result": {
          "tenantVrf": [
            {
              "id": "643520518573527040",
              "name": "VSNDemo"
            }
          ],
          "port": [
            {
              "id": "643520995436531712",
              "name": "G0"
            }
          ]
        }
      })
    )
  }),
  rest.get('/vsm/logical/vlanIdAndPortIdExist', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": false,
        "message": "此物理端口在当前vlanId已被占用，请更换vlanId或者是物理端口",
        "code": 201409,
        "timestamp": 1678958191169,
        "result": null
      })
    )
  }),
  rest.get('/vsm/vpnSite/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json(getVPNSiteResponse)
    )
  }),
  rest.post('/vsm/token/refresh', (req, res, ctx) => {
    return res(
        ctx.json(loginSuccessPayload)
    )
  }),
  rest.post('/token/refresh', (req, res, ctx) => {
    return res(
        ctx.json(loginSuccessPayload)
    )
  }),
  rest.post('/vsm/token/logout', (req, res,ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),
  rest.get('/vsm/logical/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json(logicalInterfaceResponse)
    )
  }),
  rest.get('/vsm/tenant/select', (req, res, ctx) => {
    return res(
      ctx.json({
        "success":true,
        "message":"请求成功",
        "code":10000,
        "timestamp":1669861434238,
        "result":[
            {
                "id":"fuHs12KWPMMajahsMz1LbLUKl0AIJ7n83WgrqJnTGvi6n0MEc/ek+xVo1fqooGjyHnnbFwwSvXdXmaY7L+cczKuB2o+AKU/f6EJNzj8+fz/QlzD025XGzmJq+rqCidIOZ4UB4QhnztY2GqDJlRLlk5OrvuoM0zZ4a8aseSu0tCD1i+9XPkt7dKIAqnod7xZkY8zdku8EJTiF17YHheL/Tt53kCoEpazOUxSWP6XfiBNhO+FQRihRjzyHomuEMCS5ik4lJQYq/wR3XElth3JkXjF8dnBdW0EayVBgCMjP7qcsQxSbYWSTMtIQVsV+xdtsi9w0k0m3xjFU8krqh9ioJA==",
                "name":"First-test"
            },
            {
                "id":"S1hzB/XID7W7KLt2I8MDaFqNi87RaBVGiUVlTLZy41U54o19nrQGpCqXTvg3tK9AZZZSjguY+HeYLrwZ+h/lzbcDZK6SPk20B+1Tu1KU1+UlNBWye+XC9JXZLrjD3x7SXqE9qKDU8pwFXGKuAY2Q+mq561yECP5RYASsfhXs2L6Iivn/OHcuvjzWCG0KSWNYNR4dyovkImdVdfc0/vtI+eY0R7nFjzaX1/4z+ycgUb7QTppf7Gb2XHMMTQzOGy2PgWprcup06FN2xK12+lLo4C3R8y6OTR3hgGFq1WE+oOtg16mpNnV4nRK08NS4Md3yc8ZKPE3cFYG70SatRq1qLw==",
                "name":"Dirty-janes"
            },
            {
                "id":"s1HO+Ntn0XCUk0mDVfP0dPmRDul94xaFP/D1AYMFa+HDoiPjYkQoYbHUU4goT5rfQcWvTvX5HjszHQxtbSdrIEvRNmJgMUb2rt7O1KmMJjZAjZoqqJe66z0Q0TsCHkWhV1k4RNxlvGWluvs0mmYCvj0W8SKV6VkmdFH3HJ+0wv2v5QmboKS6dxUYwtbz6zSegvuAAAcKSHU2xy0lPRVaCDv+F/HCbY0JVMnDPbuVADyKJ0LnxHxlrmhBc48fnbX4f8rRkx8Vg8Fh842Tc5b8D3CriNztPFjG9B/VDhcxDZmtqT+3RuPEMEcQciQeMfYmFkUsA/7+wcAuuP1FCojN4w==",
                "name":"Brace-test"
            },
            {
                "id":"IwEu4Q2uH8+kzTEUWLrzZM5U+08QzLqcFvGKRQZLQ3487PyXBkDOPSy2lnaMPUX3BAefhfQw2vJoirqS9rfal6kWG3ZJ/wdyN7CNI2FovQ8QpNM4ymFfLuZoQdJ9RExOI9FBRRywpbitWc2Db29EfChNOL+XRdlVgGi9DyqEOlFvmwbEmxmAlSvMmQpIcGxjXxprJlzqWZPHi9Lpx5sGEYeWYneg4pLrtN8Q+T26VYHwYzzHPCJbzFuMG/5bD2mOS+RAky80KgO2gSmsEkGD2mttz2t0u0Z8wtZ608VfTR6BnloPO7vdX3f1Tox8G7NqRIp2CZl6/bGPs7DzvSK+Ew==",
                "name":"VSNExpress"
            },
            {
                "id":"oWBnIXQ1DcumPVsNosptfDZKpoSnSkpw+2oBkq0NhMOv0D9Q0Bp7OFr8BhqF35NFwE/H2dwzdtwWyz5vdA/OuHpgJw/0PlqAEo+B1qbBa3qH1rpBQu0xyl6V6jk297Z/lJbcz/YJL+6KwGsflrx3nxuYObZV6w6q6vIJGy9axpHNP60yQx9X4HXTKbJ25c6J4/+ZzxMSZFInDRWPwbdErTIiHNO0jiu0/Qpoe+TmzkPtyOPIORZk9yQnR2oEDFHnYvbQ0uMJxHmG98Jo4hiYlvhSTlIhk0/wfDmjo9Wi4VVOYYpMNvkcTyAvCedcbzUdZYbqEbXO2D7G/OAbiS5Hdg==",
                "name":"performancetest"
            },
            {
                "id":"Ifq+26kCWPaI7qv9cKOqgeiCvSorFasjaRu0WMw9lsa7r5xKRCyhivV+d5/XHYCBUdKLv6u9j/KVbzFh1gtI7lI3wTVEV4XDLeqIGUbORURDnA5tCdW4rHCo9QnkPAnmE7so3Hm5fmZ9097wZP1h0ErjzrZA5F7VYgmJ5wg68RhgINZtjjkzoeQFR4sTmM0oN9fWnL8GyBhlZ/bADfu8vZPErxZ36VcQe3SA0SMqDi4n9H4jFoO3CT0ZnVUSuPyYV2zp+gdPOiXBYQY/9i8H8K3/4GPlawt5hOhVpL1uGkdNhlTS1aIprM/8iut3gQCSrHM3xzYBEaSwMqRMyNeSXQ==",
                "name":"Netlinkz"
            },
            {
                "id":"plXq7AEAreZQptydNShM0Ju0354DrGcNl48ENeq2sqdaQzVrSrDHTu8JSs33ub3lSi5cWJKho5suouqJs+AmciPRhZZzyDG5fzAvn/nlsvef/VztBw7ObJNUnfufK7xHNLwq/O1RmSHRMCKm/hEg0b9FknI2laGaZTsdK6wmavzn7Y4hv1T/i5BPCByV4mJ8FzCvwmS0c+1CgVRg6aQ++oiCZmLGf2ngX2yTB6NmWF/FNNZjU3x6LoKH0ZxzUM66lKdbqlfvWQwgQSGwQGwI2Zptji8daMxTUD/WgJQQpzCBZ3nbWYgaLE70as5ijs7giMr6cgcxx5fmjlWi2xWxxA==",
                "name":"apac.demo1"
            },
            {
                "id":"Wm8Z95vQSnGoFmuyPUhT4uuM7s1Y/pNvj7KXzxmymrg66A08E0DLOkWC/aZIao/7rccXPz6p3TlzElhhL3nKIydmAd4DDLnzrLOHp5fNAkT07aLmZ2HvBq+MsHiIB5Q+uV784Su58RadpqEPtucXWzCMWq9z5p15W2MbfIkpzcyAppWm1dPk7sh8NMgrHp2qTi3diYo1tyzVYIC470kfrpMnuL0u5pHUCF1yADvD14OWJ8cGksahyEc8gmzZisbopza/LU4Zme4cGS9uLWuAjNR6yP+ucyRLxMCwDP/V/8Pe1EvZdgy7OERZJxV0X8+4Piat3Ly2rXpUBd0TeC14Nw==",
                "name":"Antonio Verde"
            }
        ]
      })
    )
  }),
  rest.get('/vsm/index/deviceConnectionCount?tenantId=Ifq%2B26kCWPaI7qv9cKOqgeiCvSorFasjaRu0WMw9lsa7r5xKRCyhivV%2Bd5%2FXHYCBUdKLv6u9j%2FKVbzFh1gtI7lI3wTVEV4XDLeqIGUbORURDnA5tCdW4rHCo9QnkPAnmE7so3Hm5fmZ9097wZP1h0ErjzrZA5F7VYgmJ5wg68RhgINZtjjkzoeQFR4sTmM0oN9fWnL8GyBhlZ%2FbADfu8vZPErxZ36VcQe3SA0SMqDi4n9H4jFoO3CT0ZnVUSuPyYV2zp%2BgdPOiXBYQY%2F9i8H8K3%2F4GPlawt5hOhVpL1uGkdNhlTS1aIprM%2F8iut3gQCSrHM3xzYBEaSwMqRMyNeSXQ%3D%3D', (req, res, ctx) => {
    return res(
        ctx.json({
            "success": true,
            "message": "请求成功",
            "code": 10000,
            "timestamp": 1669865143421,
            "result": {
              "vsr0001": {
                "connection": 7,
                "down": 24,
                "compare": 0
              },
              "vsr0002": {
                "connection": 0,
                "down": 0,
                "compare": 0
              }
            }
          })
    )
  }),
  rest.get('/vsm/index/getVpns', (req, res, ctx) => {
    return res(
        ctx.json({
            "success": true,
            "message": "请求成功",
            "code": 10000,
            "timestamp": 1669865143407,
            "result": {
              "siteVpn": {
                "connected": 1,
                "disconnected": 5
              },
              "clientVpn": {
                "connected": 4
              }
            }
          })
    )
  }),
  rest.get('/vsm/device/getDevSelect?tenantId=', (req, res, ctx) => {
    return res(
        ctx.json({
            "success": true,
            "message": "请求成功",
            "code": 10000,
            "timestamp": 1669866131248,
            "result": [
              {
                "id": "536035412192268288",
                "name": "Netlinkz-NaaS-1"
              },
              {
                "id": "536247525334585344",
                "name": "03000002"
              },
              {
                "id": "546398150181523456",
                "name": "Netlinkz-office-1"
              },
              {
                "id": "551900070673387520",
                "name": "03000004"
              },
              {
                "id": "557262615101837312",
                "name": "Dirty-janes-Edge-1"
              },
              {
                "id": "557262615361884160",
                "name": "Dirty-janes-Edge-2"
              },
              {
                "id": "567130600624885760",
                "name": "03000007"
              },
              {
                "id": "567130600813629440",
                "name": "First-test-Edge-5"
              },
              {
                "id": "585519822134054912",
                "name": "03000009"
              },
              {
                "id": "585519824570945536",
                "name": "0300000A"
              },
              {
                "id": "585522060441161728",
                "name": "0300000B"
              },
              {
                "id": "585522060776706048",
                "name": "0300000C"
              },
              {
                "id": "585522061019975680",
                "name": "Brace-test-Edge-5"
              },
              {
                "id": "597114571479584768",
                "name": "iperf-edge-1"
              },
              {
                "id": "597114571911598080",
                "name": "iperf-edge-2"
              },
              {
                "id": "598211897166139392",
                "name": "VSNExpress-Edge-1"
              },
              {
                "id": "600448880621916160",
                "name": "OVH-NaaS-Edge-SYD"
              },
              {
                "id": "607680221834907648",
                "name": "naas.syd1-apac.demo1"
              },
              {
                "id": "607986132088524800",
                "name": "03000013"
              },
              {
                "id": "608001183642030080",
                "name": "Verde-NaaS-Edge"
              },
              {
                "id": "608004557926043648",
                "name": "Netlinkz-Edge-2"
              },
              {
                "id": "608334167599484928",
                "name": "Netlinkz-NaaS-Edge"
              },
              {
                "id": "609462180248555520",
                "name": "Antonio Verde-Edge-1"
              },
              {
                "id": "609976684359192576",
                "name": "03000018"
              },
              {
                "id": "609978497439371264",
                "name": "03000019"
              },
              {
                "id": "609980043136864256",
                "name": "0300001A"
              },
              {
                "id": "609981746083008512",
                "name": "0300001B"
              },
              {
                "id": "609981829172170752",
                "name": "0300001C"
              },
              {
                "id": "610215753076969472",
                "name": "0300001D"
              },
              {
                "id": "610564898652426240",
                "name": "0300001E"
              },
              {
                "id": "610565079896690688",
                "name": "edge.syd1-apac.demo1"
              }
            ]
          })
    )
  }),
  rest.get('/vsm/index/deviceSortBy?pageNo=1&pageSize=10&sortBy=CPU&tenantId=Ifq%2B26kCWPaI7qv9cKOqgeiCvSorFasjaRu0WMw9lsa7r5xKRCyhivV%2Bd5%2FXHYCBUdKLv6u9j%2FKVbzFh1gtI7lI3wTVEV4XDLeqIGUbORURDnA5tCdW4rHCo9QnkPAnmE7so3Hm5fmZ9097wZP1h0ErjzrZA5F7VYgmJ5wg68RhgINZtjjkzoeQFR4sTmM0oN9fWnL8GyBhlZ%2FbADfu8vZPErxZ36VcQe3SA0SMqDi4n9H4jFoO3CT0ZnVUSuPyYV2zp%2BgdPOiXBYQY%2F9i8H8K3%2F4GPlawt5hOhVpL1uGkdNhlTS1aIprM%2F8iut3gQCSrHM3xzYBEaSwMqRMyNeSXQ%3D%3D', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1690172721605,
          "result": {
              "content": [
                  {
                      "id": "655142338535886848",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "655142338535886848",
                      "edgeName": "NaaS_SYD1",
                      "status": "Online",
                      "cpu": 4.87,
                      "memory": 33.00,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "661295483544670208",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "661295483544670208",
                      "edgeName": "NaaS_HK2",
                      "status": "Online",
                      "cpu": 4.20,
                      "memory": 6.30,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "640605671607242752",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "640605671607242752",
                      "edgeName": "NaaS_SGP2",
                      "status": "Online",
                      "cpu": 2.60,
                      "memory": 13.20,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "585522060776706048",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "585522060776706048",
                      "edgeName": "NaaS_SG2",
                      "status": "Online",
                      "cpu": 2.40,
                      "memory": 27.60,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "640217627909689344",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "640217627909689344",
                      "edgeName": "NaaS_BKK2",
                      "status": "Online",
                      "cpu": 1.60,
                      "memory": 13.40,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "639861000710918144",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "639861000710918144",
                      "edgeName": "NaaS_BKK1",
                      "status": "Online",
                      "cpu": 0.60,
                      "memory": 13.60,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "655161599534829568",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "655161599534829568",
                      "edgeName": "NaaS_SYD1",
                      "status": "Online",
                      "cpu": 0.60,
                      "memory": 13.20,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "536035412192268288",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "536035412192268288",
                      "edgeName": "03000001",
                      "status": "Offline",
                      "cpu": 0.00,
                      "memory": 0.00,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "536247525334585344",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "536247525334585344",
                      "edgeName": "03000002",
                      "status": "Offline",
                      "cpu": 0.00,
                      "memory": 0.00,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  },
                  {
                      "id": "546398150181523456",
                      "create_by": null,
                      "create_time": null,
                      "del_flag": 0,
                      "update_by": null,
                      "update_time": null,
                      "dev_id": "546398150181523456",
                      "edgeName": "03000003",
                      "status": "Offline",
                      "cpu": 0.00,
                      "memory": 0.00,
                      "trafficSent": 0,
                      "trafficReceived": 0,
                      "tenantId　": null
                  }
              ],
              "pageable": {
                  "sort": {
                      "sorted": false,
                      "unsorted": true,
                      "empty": true
                  },
                  "pageNumber": 0,
                  "pageSize": 10,
                  "offset": 0,
                  "paged": true,
                  "unpaged": false
              },
              "totalElements": 83,
              "totalPages": 9,
              "last": false,
              "first": true,
              "sort": {
                  "sorted": false,
                  "unsorted": true,
                  "empty": true
              },
              "numberOfElements": 10,
              "size": 10,
              "number": 0,
              "empty": false
          }
      })
    )
  }),
  rest.get('/vsm/permission/getMenuList', (req, res, ctx) => {
    return res(
        ctx.json(menuList)
    )
  }),
  rest.get('/vsm/apps/getApp', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1687439254990,
        "result": {
          "id": "658102101884276736",
          "createBy": "gkxadmin",
          "createTime": "2023-06-20 20:35:09",
          "updateBy": "gkxadmin",
          "updateTime": "2023-06-20 20:35:09",
          "delFlag": 0,
          "appId": null,
          "appName": "testgkx",
          "appDescription": null,
          "tenantId": "669335150810632192",
          "tenantName": null,
          "apps": "683758205087518720",
          "groupName": null,
          "matchingCriteria": "ACL",
          "appPriority": 1,
          "appEantryList": [
            {
              "id": "683763837370896384",
              "createBy": "gkxadmin",
              "createTime": "2023-06-21 02:05:44",
              "updateBy": "gkxadmin",
              "updateTime": "2023-06-21 02:05:44",
              "delFlag": 0,
              "appId": "658102101884276736",
              "tenantId": null,
              "dscp": "219612545961431041",
              "protocol": "219612546049511426",
              "sourceIp": "8.8.8.8/32",
              "sourcePort": 888,
              "destinationIp": "10.10.10.10/32",
              "destinationPort": 999,
              "priority": 2,
              "sortOrder": 0
            }
          ],
          "appDscp": null,
          "appProtocol": null,
          "sourcePort": null,
          "destinationPort": null
        }
      })
    )
  }),
  rest.post('/vsm/device/getDevInfo', (req, res, ctx) => {
    return res(
        ctx.json({
            "success": true,
            "message": "请求成功",
            "code": 10000,
            "timestamp": 1669866293257,
            "result": {
              "id": "536035412192268288",
              "deviceType": "vsr1100",
              "deviceName": "Netlinkz-NaaS-1",
              "deviceSerialNumber": "03000001",
              "hardwareVersion": "2.3.0",
              "upInformation": false,
              "memo": "Netlinkz NaaS Edge in AWS",
              "devAddrName": "",
              "tenantId": null,
              "tenantName": null,
              "mobileEnable": false,
              "address": "",
              "deviceLocation": "Edge",
              "cloudBind": false
            }
          })
    )
  }),
  rest.get('/vsm/device/getNaaSDevSelect', (req,res,ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1676010362684,
          "result": [
            {
              "id": "607986132088524800",
              "name": "naasedge1.sg.ovh1"
            },
            {
              "id": "608001183642030080",
              "name": "Verde-NaaS-Edge"
            },
            {
              "id": "608334167599484928",
              "name": "apac.demo1.naas.edge1"
            },
            {
              "id": "632677789538979840",
              "name": "naasedge1.ger.hetzner"
            },
            {
              "id": "632745293628051456",
              "name": "naasedge2.ger.hetzner"
            },
            {
              "id": "635632619245015040",
              "name": "NaaS_SYD1"
            },
            {
              "id": "636019248472264704",
              "name": "NaaS_SYD2"
            }
          ]
        })
    )
  }),
  rest.get('/vsm/monitor/device/naasDeviceBaseInfo', (req,res,ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1676010411472,
          "result": {
            "deviceSeries": "03000016",
            "routerID": "198.51.100.1",
            "routerNum": "0",
            "routerAS": "65000",
            "online": true,
            "deviceName": "apac.demo1.naas.edge1",
            "neighborsNum": "0"
          }
        })
    )
  }),
  rest.get('/vsm/monitor/device/naasBGPInfo', (req,res,ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1676010411464,
          "result": {
            "content": [],
            "pageable": {
              "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
              },
              "pageNumber": 0,
              "pageSize": 5,
              "offset": 0,
              "paged": true,
              "unpaged": false
            },
            "last": true,
            "totalElements": 0,
            "totalPages": 0,
            "first": true,
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "numberOfElements": 0,
            "size": 5,
            "number": 0,
            "empty": true
          }
        })
    )
  }),
  rest.get('/vsm/monitor/device/deviceBaseInfo', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1676001021661,
          "result": {
            "flowDown": 743,
            "memory": 30.6,
            "cpu": 2.8,
            "tunnelActive": 0,
            "keepTime": 446880,
            "siteVPNcon": 0,
            "deviceSeries": "03000024",
            "tunnelAll": 0,
            "clientVPNcon": 0,
            "online": true,
            "startTime": 1674780022000,
            "flowUp": 473
          }
        })
    )
  }),
  rest.get('/vsm/monitor/device/onlineStateChart', (req, res, ctx) => {
    return res(
        ctx.json({
            "success": true,
            "message": "请求成功",
            "code": 10000,
            "timestamp": 1669866293365,
            "result": {
              "name": "cpu",
              "isFavorite": false,
              "position": "device_cpu",
              "data": [
                {
                  "name": "online",
                  "data": []
                }
              ],
              "time": []
            }
          })
    )
  }),
  rest.get('/vsm/monitor/device/deviceCpuLoadTimeChart', (req, res, ctx) => {
    return res(
        ctx.json({
            "success": true,
            "message": "请求成功",
            "code": 10000,
            "timestamp": 1669866293365,
            "result": {
              "name": "cpu",
              "isFavorite": false,
              "position": "device_cpu",
              "data": [
                {
                  "name": "online",
                  "data": []
                }
              ],
              "time": []
            }
          })
    )
  }),
  rest.get('/vsm/monitor/device/deviceMemoryLoadTimeChart', (req, res, ctx) => {
    return res(
        ctx.json({
            "success": true,
            "message": "请求成功",
            "code": 10000,
            "timestamp": 1669866293365,
            "result": {
              "name": "cpu",
              "isFavorite": false,
              "position": "device_cpu",
              "data": [
                {
                  "name": "online",
                  "data": []
                }
              ],
              "time": []
            }
          })
    )
  }),
  rest.get('/vsm/monitor/device/deviceNetworkFlowTotallyChart', (req, res, ctx) => {
    return res(
        ctx.json({
            "success": true,
            "message": "请求成功",
            "code": 10000,
            "timestamp": 1669866293365,
            "result": {
              "name": "cpu",
              "isFavorite": false,
              "position": "device_cpu",
              "data": [
                {
                  "name": "online",
                  "data": []
                }
              ],
              "time": []
            }
          })
    )
  }),
  rest.get('/vsm/port/getPortList?deviceId=536035412192268288&pageSize=10&page=1', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1670195907149,
        "result": {
          "content": [
            {
              "id": "536035412318097408",
              "portType": 257,
              "portName": "G0",
              "portIndex": null,
              "portEnabled": true,
              "portStatus": null,
              "portCategoryId": null,
              "portCategory": null,
              "portRateId": null,
              "portRate": null,
              "portDuplexId": null,
              "portDuplex": null,
              "lteApn": null,
              "wifiBands": null,
              "wifiCountryCode": null,
              "wifiSsid": null,
              "wifiPwd": null,
              "deviceId": "536035412192268288",
              "topic": null,
              "internalName": "G0",
              "interfaceType": "UNDEFINED_TYPE",
              "ifIndex": "1",
              "adminStatus": "UP",
              "operStatus": "UP",
              "lastChange": "1658556526",
              "physAddress": "06:0d:5b:b6:7e:3a",
              "speed": "0",
              "mtu": 9202,
              "duplex": "FULL",
              "statistics": "{\"ipv4_packets\":\"3528\",\"in_bytes\":\"585107\",\"drop_packets\":\"65\",\"punt_packets\":\"0\",\"out_error_packets\":\"0\",\"in_nobuf_packets\":\"0\",\"out_bytes\":\"424194\",\"in_miss_packets\":\"0\",\"ipv6_packets\":\"0\",\"out_packets\":\"7928\",\"in_packets\":\"9406\",\"in_error_packets\":\"6\"}",
              "lastOnlineTime": "2022-07-27 02:04:53",
              "wifi": "",
              "lte": ""
            },
            {
              "id": "536035412318097409",
              "portType": 257,
              "portName": "G1",
              "portIndex": null,
              "portEnabled": false,
              "portStatus": null,
              "portCategoryId": null,
              "portCategory": null,
              "portRateId": null,
              "portRate": null,
              "portDuplexId": null,
              "portDuplex": null,
              "lteApn": null,
              "wifiBands": null,
              "wifiCountryCode": null,
              "wifiSsid": null,
              "wifiPwd": null,
              "deviceId": "536035412192268288",
              "topic": null,
              "internalName": null,
              "interfaceType": null,
              "ifIndex": null,
              "adminStatus": "",
              "operStatus": "",
              "lastChange": null,
              "physAddress": null,
              "speed": null,
              "mtu": null,
              "duplex": null,
              "statistics": null,
              "lastOnlineTime": null,
              "wifi": null,
              "lte": null
            },
            {
              "id": "536035412318097410",
              "portType": 257,
              "portName": "G2",
              "portIndex": null,
              "portEnabled": false,
              "portStatus": null,
              "portCategoryId": null,
              "portCategory": null,
              "portRateId": null,
              "portRate": null,
              "portDuplexId": null,
              "portDuplex": null,
              "lteApn": null,
              "wifiBands": null,
              "wifiCountryCode": null,
              "wifiSsid": null,
              "wifiPwd": null,
              "deviceId": "536035412192268288",
              "topic": null,
              "internalName": null,
              "interfaceType": null,
              "ifIndex": null,
              "adminStatus": "",
              "operStatus": "",
              "lastChange": null,
              "physAddress": null,
              "speed": null,
              "mtu": null,
              "duplex": null,
              "statistics": null,
              "lastOnlineTime": null,
              "wifi": null,
              "lte": null
            },
            {
              "id": "536035412318097411",
              "portType": 257,
              "portName": "G3",
              "portIndex": null,
              "portEnabled": false,
              "portStatus": null,
              "portCategoryId": null,
              "portCategory": null,
              "portRateId": null,
              "portRate": null,
              "portDuplexId": null,
              "portDuplex": null,
              "lteApn": null,
              "wifiBands": null,
              "wifiCountryCode": null,
              "wifiSsid": null,
              "wifiPwd": null,
              "deviceId": "536035412192268288",
              "topic": null,
              "internalName": null,
              "interfaceType": null,
              "ifIndex": null,
              "adminStatus": "",
              "operStatus": "",
              "lastChange": null,
              "physAddress": null,
              "speed": null,
              "mtu": null,
              "duplex": null,
              "statistics": null,
              "lastOnlineTime": null,
              "wifi": null,
              "lte": null
            },
            {
              "id": "536035412318097412",
              "portType": 257,
              "portName": "G4",
              "portIndex": null,
              "portEnabled": false,
              "portStatus": null,
              "portCategoryId": null,
              "portCategory": null,
              "portRateId": null,
              "portRate": null,
              "portDuplexId": null,
              "portDuplex": null,
              "lteApn": null,
              "wifiBands": null,
              "wifiCountryCode": null,
              "wifiSsid": null,
              "wifiPwd": null,
              "deviceId": "536035412192268288",
              "topic": null,
              "internalName": null,
              "interfaceType": null,
              "ifIndex": null,
              "adminStatus": "",
              "operStatus": "",
              "lastChange": null,
              "physAddress": null,
              "speed": null,
              "mtu": null,
              "duplex": null,
              "statistics": null,
              "lastOnlineTime": null,
              "wifi": null,
              "lte": null
            },
            {
              "id": "536035412318097413",
              "portType": 768,
              "portName": "Wi-Fi",
              "portIndex": null,
              "portEnabled": false,
              "portStatus": null,
              "portCategoryId": null,
              "portCategory": null,
              "portRateId": "Static",
              "portRate": null,
              "portDuplexId": null,
              "portDuplex": null,
              "lteApn": null,
              "wifiBands": null,
              "wifiCountryCode": null,
              "wifiSsid": null,
              "wifiPwd": null,
              "deviceId": "536035412192268288",
              "topic": null,
              "internalName": null,
              "interfaceType": null,
              "ifIndex": null,
              "adminStatus": "",
              "operStatus": "",
              "lastChange": null,
              "physAddress": null,
              "speed": null,
              "mtu": null,
              "duplex": null,
              "statistics": null,
              "lastOnlineTime": null,
              "wifi": null,
              "lte": null
            },
            {
              "id": "536035412318097414",
              "portType": 1024,
              "portName": "LTE",
              "portIndex": null,
              "portEnabled": false,
              "portStatus": null,
              "portCategoryId": null,
              "portCategory": null,
              "portRateId": "DHCP",
              "portRate": null,
              "portDuplexId": null,
              "portDuplex": null,
              "lteApn": null,
              "wifiBands": null,
              "wifiCountryCode": null,
              "wifiSsid": null,
              "wifiPwd": null,
              "deviceId": "536035412192268288",
              "topic": null,
              "internalName": null,
              "interfaceType": null,
              "ifIndex": null,
              "adminStatus": "",
              "operStatus": "",
              "lastChange": null,
              "physAddress": null,
              "speed": null,
              "mtu": null,
              "duplex": null,
              "statistics": null,
              "lastOnlineTime": null,
              "wifi": null,
              "lte": null
            }
          ],
          "pageable": {
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "pageNumber": 0,
            "pageSize": 10,
            "offset": 0,
            "paged": true,
            "unpaged": false
          },
          "totalElements": 7,
          "totalPages": 1,
          "last": true,
          "first": true,
          "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
          },
          "numberOfElements": 7,
          "size": 10,
          "number": 0,
          "empty": false
        }
      })
    )
  }),
  rest.get('/vsm/logical/getLogicalPortByTts?deviceId=536035412192268288&type=INTERFACE_DETAIL&pageNumber=1&pageSize=10', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1670200124964,
        "result": [
          {
            "Dhcp": {
              "GWAddress": "172.31.32.1/20",
              "IPAddress": "172.31.35.15/20",
              "LeaseTime": "2022/07/27 02:39:07"
            },
            "Type": "DPDK",
            "loginc_name": "WAN-Ethernet",
            "GWAddress": "",
            "State": "UP",
            "SetDhcpClient": true,
            "IPAddress": [],
            "PhyAddress": "",
            "Name": "G0",
            "MTU": "1500"
          }
        ]
      })
    )
  }),
  rest.get('/vsm/port/getPhysicalPort?deviceId=536035412192268288&tenantId=', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1670200124963,
        "result": {
          "port": [
            {
              "id": "536035412318097408",
              "name": "G0"
            },
            {
              "id": "536035412318097409",
              "name": "G1"
            },
            {
              "id": "536035412318097410",
              "name": "G2"
            },
            {
              "id": "536035412318097411",
              "name": "G3"
            },
            {
              "id": "536035412318097412",
              "name": "G4"
            },
            {
              "id": "536035412318097413",
              "name": "Wi-Fi"
            },
            {
              "id": "536035412318097414",
              "name": "LTE"
            }
          ]
        }
      })
    )
  }),
  rest.get('/vsm/monitor/device/deviceNetworkFlowTotallyChart?deviceId=536035412192268288&deviceType=000206&userId=609434461569814529&timeGap=600&startDate=2022-12-04+13:00:00&endDate=2022-12-05+00:28:45', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1670200125083,
        "result": {
          "name": "totalFlow",
          "isFavorite": false,
          "position": "device_totalFlowTimely",
          "data": [
            {
              "name": "up",
              "data": []
            },
            {
              "name": "down",
              "data": []
            }
          ],
          "time": []
        }
      })
    )
  }),
  rest.get('/vsm/monitor/device/devicePortNetworkFlowChart', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1670200595048,
        "result": {
          "name": "G2",
          "isFavorite": false,
          "position": "device_portFlow_G2",
          "data": [
            {
              "name": "flowUp",
              "data": [
                "0"
              ]
            },
            {
              "name": "flowDown",
              "data": [
                "0"
              ]
            }
          ],
          "time": []
        }
      })
    )
  }),
  rest.get('/vsm/logical/getByVPNStatusByTts', (req, res, ctx) => {
    const params = new URLSearchParams(req.url.href)
    return res(
      params.get("type") === "site_vpn" ? ctx.json(getBySiteVPNStatus) : ctx.json(getByClientVPNStatus)
    )
  }),
  rest.get('/vsm/vpnSite/siteVpnOptions', (req, res, ctx) => {
    return res(
      ctx.json(siteVPNResponse)
    )
  }),
  rest.get('/vsm/tenantService/clientVpnOptions', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1670200595048
      })
    )
  }),
  rest.get('/vsm/clientGroup/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1688032746599,
        "result": {
          "content": [
            {
              "id": "1683873057551",
              "tenantId": "669335150810632192",
              "tenantName": "QA",
              "name": "CG-QA",
              "description": "",
              "subnetAddress": "192.168.100.0/24",
              "advertisedSubnets": "192.168.100.0/24",
              "dns": "1.1.1.1"
            }
          ],
          "pageable": {
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "pageNumber": 0,
            "pageSize": 10,
            "offset": 0,
            "paged": true,
            "unpaged": false
          },
          "last": true,
          "totalElements": 1,
          "totalPages": 1,
          "first": true,
          "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
          },
          "numberOfElements": 1,
          "size": 10,
          "number": 0,
          "empty": false
        }
      })
    )
  }),
  rest.get('/vsm/radius?tenantId=', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),
  rest.get('/vsm/mobileUser/exist/name?id=&vrfId=&tenantId=&username=silassuperadmin', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponseNegated)
    )
  }),
  rest.get('/vsm/mobileUser/getDomainforTenant', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1675986174669,
        "result": "123456789012345678901234567890"
      })
    )
  }),
  rest.post('/vsm/mobileUser/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json(mobileClientsListResponse)
    )
  }),
  rest.get('', (req, res, ctx) => {
    return res(
      ctx.json()
    )
  }),
  rest.get('/vsm/clientGroup/getGroupList', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1675819193212,
          "result": {
            "clientGroups": [
              {
                "id": "1670370577551",
                "name": "CG3"
              },
              {
                "id": "1670370577608",
                "name": "CG1"
              },
              {
                "id": "1670370577609",
                "name": "CG2"
              }
            ]
          }
        })
    )
  }),
  rest.get('/vsm/clientConnection/getByCondition', (req, res, ctx) => {
    return res(
        ctx.json(clientConnectionResponse)
    )
  }),
  rest.get('vsm/clientGroup/getIPList', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1675827978980,
          "result": {
            "ipList": [
              {
                "ip": "10.60.0.1",
                "value": "10.60.0.1"
              },
              {
                "ip": "10.60.0.2",
                "value": "10.60.0.2"
              },
              {
                "ip": "10.60.0.6",
                "value": "10.60.0.6"
              }
            ]
          }
        })
    )
  }),
  rest.post('/vsm/device/getByCondition', (req, res, ctx) => {
    return res(
        ctx.json({
              "success": true,
              "message": "请求成功",
              "code": 10000,
              "timestamp": 1675935272092,
              "result": {
                "content": [
                  {
                    "id": "607680221834907648",
                    "deviceType": "vsr1100",
                    "deviceName": "naasedge2.syd.ovh1",
                    "deviceSerialNumber": "03000012",
                    "hardwareVersion": "3.0",
                    "upInformation": false,
                    "memo": "naas-edge2; Public IP: 139.99.232.243; Jump Number: 2D7A1389-56D8-4537-8E77-2DE54EA0AB6D",
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "NaaS Edge",
                    "cloudBind": false,
                    "activated": true
                  },
                  {
                    "id": "607986132088524800",
                    "deviceType": "vsr1100",
                    "deviceName": "naasedge1.sg.ovh1",
                    "deviceSerialNumber": "03000013",
                    "hardwareVersion": "3.0",
                    "upInformation": true,
                    "memo": "naas-edge1; Public IP: 139.99.118.154; Jump Number: 8844287B-B3D9-4E82-9A69-23C12C69770C",
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "NaaS Edge",
                    "cloudBind": false,
                    "activated": true
                  },
                  {
                    "id": "608004557926043648",
                    "deviceType": "vsr1100",
                    "deviceName": "edge.office1",
                    "deviceSerialNumber": "03000015",
                    "hardwareVersion": "3.1",
                    "upInformation": true,
                    "memo": "Edge previously given to Yingbin for WiFi troubleshooting; Jump Number: KSA5076417",
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "Edge",
                    "cloudBind": false,
                    "activated": true
                  },
                  {
                    "id": "609981746083008512",
                    "deviceType": "vsr1100",
                    "deviceName": "naasedge3.syd.ovh2",
                    "deviceSerialNumber": "0300001B",
                    "hardwareVersion": "3.0",
                    "upInformation": false,
                    "memo": "naas-edge3; Public IP: 139.99.252.29; Jump Number: edf79ab2-d1c2-437a-9bc6-9209e6d5bb12",
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "NaaS Edge",
                    "cloudBind": false,
                    "activated": false
                  },
                  {
                    "id": "617785733138092032",
                    "deviceType": "vsr1100",
                    "deviceName": "edge.shawn1",
                    "deviceSerialNumber": "03000021",
                    "hardwareVersion": "3.0.0",
                    "upInformation": true,
                    "memo": "401/56 Bowman St, Pyrmont, NSW; Jump Number: KSA4977592",
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "Edge",
                    "cloudBind": false,
                    "activated": true
                  },
                  {
                    "id": "622553581886640128",
                    "deviceType": "vsr1100",
                    "deviceName": "edge.rotemhouse1",
                    "deviceSerialNumber": "03000022",
                    "hardwareVersion": "1.1.1.1",
                    "upInformation": true,
                    "memo": "8 Clarke Avenue, Melbourne, VIC",
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "Edge",
                    "cloudBind": false,
                    "activated": true
                  },
                  {
                    "id": "624701842407821312",
                    "deviceType": "vsr1100",
                    "deviceName": "3.0QA-Edge-16",
                    "deviceSerialNumber": "03000023",
                    "hardwareVersion": "3.0.0",
                    "upInformation": true,
                    "memo": null,
                    "devAddrName": null,
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": null,
                    "deviceLocation": "Edge",
                    "cloudBind": false,
                    "activated": true
                  },
                  {
                    "id": "630435462070145024",
                    "deviceType": "vsr1100",
                    "deviceName": "edge.rotemhouse2",
                    "deviceSerialNumber": "03000024",
                    "hardwareVersion": "1.1.1.1",
                    "upInformation": true,
                    "memo": "8 Clarke Avenue, Melbourne, VIC",
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "Edge",
                    "cloudBind": false,
                    "activated": true
                  },
                  {
                    "id": "632677789538979840",
                    "deviceType": "vsr1100",
                    "deviceName": "naasedge1.ger.hetzner",
                    "deviceSerialNumber": "03000026",
                    "hardwareVersion": "3.0.0",
                    "upInformation": true,
                    "memo": "Jason NaaS Edge",
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "NaaS Edge",
                    "cloudBind": false,
                    "activated": true
                  },
                  {
                    "id": "632745293628051456",
                    "deviceType": "vsr1100",
                    "deviceName": "naasedge2.ger.hetzner",
                    "deviceSerialNumber": "03000027",
                    "hardwareVersion": "3.0.0",
                    "upInformation": false,
                    "memo": null,
                    "devAddrName": "",
                    "tenantId": "625033608159039488",
                    "tenantName": "3.0QA",
                    "mobileEnable": false,
                    "address": "",
                    "deviceLocation": "NaaS Edge",
                    "cloudBind": false,
                    "activated": false
                  }
                ],
                "pageable": {
                  "sort": {
                    "sorted": false,
                    "unsorted": true,
                    "empty": true
                  },
                  "pageNumber": 0,
                  "pageSize": 10,
                  "offset": 0,
                  "paged": true,
                  "unpaged": false
                },
                "last": false,
                "totalElements": 12,
                "totalPages": 2,
                "first": true,
                "sort": {
                  "sorted": false,
                  "unsorted": true,
                  "empty": true
                },
                "numberOfElements": 10,
                "size": 10,
                "number": 0,
                "empty": false
              }
            }
        )
    )
  }),
  rest.get('/vsm/device/getDevSerialName', (req,res,ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1676010622939,
          "result": [
            "03000001,03000001",
            "03000002,03000002",
            "03000003,03000003",
            "03000004,03000004",
            "03000005,03000005",
            "03000006,03000006",
            "03000007,03000007",
            "03000008,03000008",
            "03000009,03000009",
            "0300000A,0300000A",
            "0300000B,0300000B",
            "0300000C,0300000C",
            "0300000D,Brace-test-Edge-5",
            "0300000E,0300000E",
            "0300000F,0300000F",
            "03000010,03000010",
            "03000011,03000011",
            "03000012,03000012",
            "03000013,naasedge1.sg.ovh1",
            "03000014,Verde-NaaS-Edge",
            "03000015,edge.office1",
            "03000016,apac.demo1.naas.edge1",
            "03000017,Antonio Verde-Edge-1",
            "03000018,03000018",
            "03000019,03000019",
            "0300001A,0300001A",
            "0300001B,0300001B",
            "0300001C,0300001C",
            "0300001D,0300001D",
            "0300001E,0300001E",
            "0300001F,edge.syd1-apac.demo1",
            "03000020,03000020",
            "03000021,edge.shawn1",
            "03000022,edge.rotemhouse1",
            "03000023,03000023",
            "03000024,edge.rotemhouse2",
            "03000025,03000025",
            "03000026,naasedge1.ger.hetzner",
            "03000027,naasedge2.ger.hetzner",
            "03000028,NaaS_SYD1",
            "03000029,NaaS_SYD2",
            "0300002A,0300002A",
            "0300002B,0300002B"
          ]
        })
    )
  }),
  rest.post('vsm/screenSet/findOperation', (req, res, ctx) => {
    return res(
        ctx.json({
              "success": true,
              "message": "请求成功",
              "code": 10000,
              "timestamp": 1675935272020,
              "result": {
                "provinceList": []
              }
            }
        )
    )
  }),
  rest.get('vsm/device/getDevSerialName', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1675935272094,
          "result": [
            "03000012,naasedge2.syd.ovh1",
            "03000013,naasedge1.sg.ovh1",
            "03000015,edge.office1",
            "0300001B,naasedge3.syd.ovh2",
            "03000021,edge.shawn1",
            "03000022,edge.rotemhouse1",
            "03000023,3.0QA-Edge-16",
            "03000024,edge.rotemhouse2",
            "03000026,naasedge1.ger.hetzner",
            "03000027,naasedge2.ger.hetzner",
            "03000028,naas.syd4",
            "03000029,3.0QA-Edge-17"
          ]
        })
    )
  }),
  rest.get('/vsm/port/getByCondition', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1677453011496,
          "result": {
            "content": [
              {
                "id": "608004557997346816",
                "portType": 257,
                "portName": "G0",
                "portIndex": null,
                "portEnabled": true,
                "portStatus": null,
                "portCategoryId": null,
                "portCategory": null,
                "portRateId": null,
                "portRate": null,
                "portDuplexId": null,
                "portDuplex": null,
                "lteApn": null,
                "wifiBands": "",
                "wifiCountryCode": "",
                "wifiSsid": "",
                "wifiPwd": "",
                "deviceId": "608004557926043648",
                "topic": null,
                "internalName": null,
                "interfaceType": null,
                "ifIndex": null,
                "adminStatus": null,
                "operStatus": null,
                "lastChange": null,
                "physAddress": null,
                "speed": null,
                "mtu": null,
                "duplex": null,
                "statistics": null,
                "lastOnlineTime": null,
                "wifi": null,
                "lte": null
              },
              {
                "id": "608004557997346817",
                "portType": 257,
                "portName": "G1",
                "portIndex": null,
                "portEnabled": true,
                "portStatus": null,
                "portCategoryId": null,
                "portCategory": null,
                "portRateId": null,
                "portRate": null,
                "portDuplexId": null,
                "portDuplex": null,
                "lteApn": null,
                "wifiBands": "",
                "wifiCountryCode": "",
                "wifiSsid": "",
                "wifiPwd": "",
                "deviceId": "608004557926043648",
                "topic": null,
                "internalName": null,
                "interfaceType": null,
                "ifIndex": null,
                "adminStatus": null,
                "operStatus": null,
                "lastChange": null,
                "physAddress": null,
                "speed": null,
                "mtu": null,
                "duplex": null,
                "statistics": null,
                "lastOnlineTime": null,
                "wifi": null,
                "lte": null
              },
              {
                "id": "608004557997346818",
                "portType": 257,
                "portName": "G2",
                "portIndex": null,
                "portEnabled": true,
                "portStatus": null,
                "portCategoryId": null,
                "portCategory": null,
                "portRateId": null,
                "portRate": null,
                "portDuplexId": null,
                "portDuplex": null,
                "lteApn": null,
                "wifiBands": "",
                "wifiCountryCode": "",
                "wifiSsid": "",
                "wifiPwd": "",
                "deviceId": "608004557926043648",
                "topic": null,
                "internalName": null,
                "interfaceType": null,
                "ifIndex": null,
                "adminStatus": null,
                "operStatus": null,
                "lastChange": null,
                "physAddress": null,
                "speed": null,
                "mtu": null,
                "duplex": null,
                "statistics": null,
                "lastOnlineTime": null,
                "wifi": null,
                "lte": null
              },
              {
                "id": "608004557997346819",
                "portType": 257,
                "portName": "G3",
                "portIndex": null,
                "portEnabled": true,
                "portStatus": null,
                "portCategoryId": null,
                "portCategory": null,
                "portRateId": null,
                "portRate": null,
                "portDuplexId": null,
                "portDuplex": null,
                "lteApn": null,
                "wifiBands": "",
                "wifiCountryCode": "",
                "wifiSsid": "",
                "wifiPwd": "",
                "deviceId": "608004557926043648",
                "topic": null,
                "internalName": null,
                "interfaceType": null,
                "ifIndex": null,
                "adminStatus": null,
                "operStatus": null,
                "lastChange": null,
                "physAddress": null,
                "speed": null,
                "mtu": null,
                "duplex": null,
                "statistics": null,
                "lastOnlineTime": null,
                "wifi": null,
                "lte": null
              },
              {
                "id": "608004557997346820",
                "portType": 257,
                "portName": "G4",
                "portIndex": null,
                "portEnabled": false,
                "portStatus": null,
                "portCategoryId": null,
                "portCategory": null,
                "portRateId": null,
                "portRate": null,
                "portDuplexId": null,
                "portDuplex": null,
                "lteApn": null,
                "wifiBands": "",
                "wifiCountryCode": "",
                "wifiSsid": "",
                "wifiPwd": "",
                "deviceId": "608004557926043648",
                "topic": null,
                "internalName": null,
                "interfaceType": null,
                "ifIndex": null,
                "adminStatus": null,
                "operStatus": null,
                "lastChange": null,
                "physAddress": null,
                "speed": null,
                "mtu": null,
                "duplex": null,
                "statistics": null,
                "lastOnlineTime": null,
                "wifi": null,
                "lte": null
              },
              {
                "id": "608004557997346821",
                "portType": 257,
                "portName": "G5",
                "portIndex": null,
                "portEnabled": false,
                "portStatus": null,
                "portCategoryId": null,
                "portCategory": null,
                "portRateId": null,
                "portRate": null,
                "portDuplexId": null,
                "portDuplex": null,
                "lteApn": null,
                "wifiBands": "",
                "wifiCountryCode": "",
                "wifiSsid": "",
                "wifiPwd": "",
                "deviceId": "608004557926043648",
                "topic": null,
                "internalName": null,
                "interfaceType": null,
                "ifIndex": null,
                "adminStatus": null,
                "operStatus": null,
                "lastChange": null,
                "physAddress": null,
                "speed": null,
                "mtu": null,
                "duplex": null,
                "statistics": null,
                "lastOnlineTime": null,
                "wifi": null,
                "lte": null
              },
              {
                "id": "608004557997346822",
                "portType": 768,
                "portName": "Wi-Fi",
                "portIndex": null,
                "portEnabled": true,
                "portStatus": null,
                "portCategoryId": null,
                "portCategory": null,
                "portRateId": "Static",
                "portRate": null,
                "portDuplexId": null,
                "portDuplex": null,
                "lteApn": null,
                "wifiBands": "5GHZ",
                "wifiCountryCode": "AU",
                "wifiSsid": "wifi-office-test-15",
                "wifiPwd": "Netlinkz@123",
                "deviceId": "608004557926043648",
                "topic": null,
                "internalName": null,
                "interfaceType": null,
                "ifIndex": null,
                "adminStatus": null,
                "operStatus": null,
                "lastChange": null,
                "physAddress": null,
                "speed": null,
                "mtu": null,
                "duplex": null,
                "statistics": null,
                "lastOnlineTime": null,
                "wifi": null,
                "lte": null
              },
              {
                "id": "608004557997346823",
                "portType": 1024,
                "portName": "LTE",
                "portIndex": null,
                "portEnabled": false,
                "portStatus": null,
                "portCategoryId": null,
                "portCategory": null,
                "portRateId": "DHCP",
                "portRate": null,
                "portDuplexId": null,
                "portDuplex": null,
                "lteApn": null,
                "wifiBands": "",
                "wifiCountryCode": "",
                "wifiSsid": "",
                "wifiPwd": "",
                "deviceId": "608004557926043648",
                "topic": null,
                "internalName": null,
                "interfaceType": null,
                "ifIndex": null,
                "adminStatus": null,
                "operStatus": null,
                "lastChange": null,
                "physAddress": null,
                "speed": null,
                "mtu": null,
                "duplex": null,
                "statistics": null,
                "lastOnlineTime": null,
                "wifi": null,
                "lte": null
              }
            ],
            "pageable": {
              "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
              },
              "pageNumber": 0,
              "pageSize": 10,
              "offset": 0,
              "paged": true,
              "unpaged": false
            },
            "totalElements": 8,
            "totalPages": 1,
            "last": true,
            "first": true,
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "numberOfElements": 8,
            "size": 10,
            "number": 0,
            "empty": false
          }
        })
    )
  }),
  rest.get('/vsm/logical/initPort', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1677453011523,
          "result": null
        })
    )
  }),
  rest.get('/vsm/addrPool/getByCondition', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1677453013476,
          "result": {
            "content": [],
            "pageable": {
              "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
              },
              "pageNumber": 0,
              "pageSize": 10,
              "offset": 0,
              "paged": true,
              "unpaged": false
            },
            "totalElements": 0,
            "totalPages": 0,
            "last": true,
            "first": true,
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "numberOfElements": 0,
            "size": 10,
            "number": 0,
            "empty": true
          }
        })
    )
  }),
  rest.get('/vsm/dhcp/getByCondition', (req, res, ctx) => {
    return res(
        ctx.json({
          "success": true,
          "message": "请求成功",
          "code": 10000,
          "timestamp": 1677453013483,
          "result": {
            "content": [
              {
                "randomId": null,
                "deviceId": "608004557926043648",
                "serverEnabled": true,
                "id": "629742259100717056",
                "name": "DHCP",
                "description": "",
                "ipStart": "192.168.33.20",
                "ipEnd": "192.168.33.200",
                "leaseTime": 120,
                "ipReserved": null,
                "gatewayIp": null,
                "dnsIp": "1.1.1.1",
                "excludeIp": null,
                "staticIpReserved": null,
                "clientInformation": null,
                "logID": "629742128875966465",
                "logicName": "LAN-Bridge"
              }
            ],
            "pageable": {
              "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
              },
              "pageNumber": 0,
              "pageSize": 10,
              "offset": 0,
              "paged": true,
              "unpaged": false
            },
            "totalElements": 1,
            "totalPages": 1,
            "last": true,
            "first": true,
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "numberOfElements": 1,
            "size": 10,
            "number": 0,
            "empty": false
          }
        })
    )
  }),
  rest.get('/vsm/monitor/device/deviceTunnelNetworkFlowChart', (req, res, ctx) => {
    return res(
        ctx.json(deviceTunnelResponse)
    )
  }),

  rest.get('/vsm/monitor/device/clientVpnUpAndDownChart', (req, res, ctx) => {
    return res(
      ctx.json(clientVpnUpAndDownChartResponse)
    )
  }),

  rest.get('/vsm/vsa/getLicense', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1682297749970,
        "result": {
          "license": {
            "ver": "1.0",
            "vsr_series": "she990uaskljLKJKJLKJ09",
            "vsr_password": "990sheuaskJKKJ09JLljLK",
            "vsa_addr": "https://vsa.netlinkz.com"
          }
        }
      })
    )
  }),

  rest.post('/vsm/vsa/edgeiso', async (req, res, ctx) => {

    return res(
      ctx.json({
        "success": true,
        "message": "Saved Successfully",
        "code": 10000,
        "timestamp": 1684116536794,
        "result": {
          "headers": {
            "Server": [
              "nginx"
            ],
            "Date": [
              "Mon, 15 May 2023 02:08:56 GMT"
            ],
            "Content-Type": [
              "application/octet-stream"
            ],
            "Content-Length": [
              "3322"
            ],
            "Connection": [
              "keep-alive"
            ],
            "Content-Disposition": [
              "attachment; filename=activation_naas-edge-2.zip"
            ],
            "Cache-Control": [
              "no-cache"
            ]
          },
          "body": "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",
          "statusCode": "OK",
          "statusCodeValue": 200
        }
      })
    )
  }),
  rest.get('/vsm/logical/getLogicLanPort', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1684722026491,
        "result": []
    })
    )
  }),

  rest.get('/vsm/dhcp/getLogicLanPort', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1684722026491,
        "result": []
    })
    )
  }),

  rest.get('vsm/snat/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1684726130838,
        "result": [
            {
                "id": "639945867859595264",
                "deviceId": "639861000710918144",
                "name": "BKK_Internet_Breakout",
                "description": null,
                "output": false,
                "outInterfaceName": "WAN-Ethernet",
                "outInterfaceId": "639902143947476992",
                "forwarding": false,
                "inside": false,
                "outPort": null,
                "outIp": "172.16.16.216/24",
                "inIp": null,
                "vrfId": null,
                "type": "Masquerading"
            }
        ]
    })
    )
  }),

  rest.get('/vsm/dnat/get', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1684726130841,
        "result": {
            "content": [],
            "pageable": {
                "sort": {
                    "sorted": false,
                    "unsorted": true,
                    "empty": true
                },
                "pageNumber": 0,
                "pageSize": 10,
                "offset": 0,
                "paged": true,
                "unpaged": false
            },
            "totalElements": 0,
            "totalPages": 0,
            "last": true,
            "first": true,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "numberOfElements": 0,
            "size": 10,
            "number": 0,
            "empty": true
        }
    })
    )
  }),
  rest.get('/vsm/snat/getSnatPort', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),
  rest.get('/vsm/logical/getLogicPortForRole', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1684726646278,
        "result": {
            "port": [
                {
                    "id": "639902143947476992",
                    "name": "WAN-Ethernet"
                }
            ],
            "portIp": [
                {
                    "id": "639902143947476992",
                    "name": "172.16.16.216/24"
                }
            ]
        }
    })
    )
  }),
  rest.get('/vsm/snat/get', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1684726646273,
        "result": {
            "id": "639945867859595264",
            "createBy": "swuadmin",
            "createTime": "2023-02-20 04:08:46",
            "updateBy": "swuadmin",
            "updateTime": "2023-02-20 04:08:46",
            "delFlag": 0,
            "deviceId": "639861000710918144",
            "name": "BKK_Internet_Breakout",
            "description": null,
            "output": false,
            "forwarding": false,
            "inside": null,
            "outInterfaceId": "639902143947476992",
            "outInterfaceName": "WAN-Ethernet",
            "outIp": "172.16.16.216/24",
            "vrfId": null,
            "dataFrom": 0,
            "inIp": null,
            "type": "Masquerading"
        }
    })
    )
  }),
  rest.get('/vsm/trafficProfiles/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1688033308433,
        "result": {
          "content": [
            {
              "id": "680935593374388223",
              "createBy": "gkxadmin",
              "createTime": "2023-06-21 04:47:17",
              "updateBy": "gkxadmin",
              "updateTime": "2023-06-21 04:47:17",
              "delFlag": 0,
              "tenantId": "669335150810632192",
              "name": "test2",
              "description": "testgkx2",
              "uploadUnlimited": true,
              "uploadRate": 2000,
              "downloadUnlimited": true,
              "downloadRate": 4000
            },
            {
              "id": "683472110202392576",
              "createBy": "superAdmin",
              "createTime": "2023-06-20 06:46:30",
              "updateBy": "superAdmin",
              "updateTime": "2023-06-20 06:46:30",
              "delFlag": 0,
              "tenantId": "669335150810632192",
              "name": "TestProfile2",
              "description": "Test Profile2",
              "uploadUnlimited": true,
              "uploadRate": null,
              "downloadUnlimited": false,
              "downloadRate": 77
            },
            {
              "id": "683472296995721216",
              "createBy": "superAdmin",
              "createTime": "2023-06-20 06:47:14",
              "updateBy": "superAdmin",
              "updateTime": "2023-06-20 06:47:14",
              "delFlag": 0,
              "tenantId": "669335150810632192",
              "name": "TestProfile3",
              "description": "Test Profile 3",
              "uploadUnlimited": false,
              "uploadRate": 55,
              "downloadUnlimited": false,
              "downloadRate": 77
            }
          ],
          "pageable": {
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "pageNumber": 0,
            "pageSize": 10,
            "offset": 0,
            "paged": true,
            "unpaged": false
          },
          "last": true,
          "totalElements": 3,
          "totalPages": 1,
          "first": true,
          "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
          },
          "numberOfElements": 3,
          "size": 10,
          "number": 0,
          "empty": false
        }
      })
    )
  }),

  rest.post('/vsm/trafficProfiles/saveOrFlush', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),

  rest.delete('/vsm/trafficProfiles/del', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),

  rest.post('/vsm/trafficProfiles/canNameUse', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),

  rest.get('/vsm/trafficLimiter/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1688033499763,
        "result": {
          "content": [
            {
              "id": "686303097214996480",
              "createBy": "superAdmin",
              "createTime": "2023-06-28 02:15:50",
              "updateBy": "superAdmin",
              "updateTime": "2023-06-28 02:15:50",
              "delFlag": 0,
              "tenantId": "669335150810632192",
              "type": "2",
              "name": "TrafficLimiter1",
              "description": "Traffic Limiter 11",
              "clientId": "669335187447877632",
              "trafficProfileId": "683472296995721216",
              "priority": 3,
              "destMatch": "Client",
              "destName": "683774935935488000",
              "appName": "658102101884276736"
            }
          ],
          "pageable": {
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "pageNumber": 0,
            "pageSize": 10,
            "offset": 0,
            "paged": true,
            "unpaged": false
          },
          "last": true,
          "totalElements": 1,
          "totalPages": 1,
          "first": true,
          "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
          },
          "numberOfElements": 1,
          "size": 10,
          "number": 0,
          "empty": false
        }
      })
    )
  }),

  rest.post('/vsm/trafficLimiter/saveOrFlush', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),

  rest.delete('/vsm/trafficLimiter/del', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),

  rest.post('/vsm/trafficLimiter/canNameUse', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),

  rest.post('/vsm/trafficLimiter/canPriorityUse', (req, res, ctx) => {
    return res(
      ctx.json(plainSuccessResponse)
    )
  }),
  rest.get('/vsm/user/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1690231883816,
        "result": {
          "content": [
            {
              "tenantName": "QA",
              "roleId": "695681175749922816",
              "tenantId": "695681171777916928",
              "roleName": "QA Admin",
              "id": "695681179453493248",
              "username": "qaAdmin"
            }
          ],
          "pageable": {
            "sort": {
              "sorted": false,
              "unsorted": true,
              "empty": true
            },
            "pageNumber": 0,
            "pageSize": 10,
            "offset": 0,
            "paged": true,
            "unpaged": false
          },
          "totalElements": 1,
          "last": true,
          "totalPages": 1,
          "first": true,
          "sort": {
            "sorted": false,
            "unsorted": true,
            "empty": true
          },
          "numberOfElements": 1,
          "size": 10,
          "number": 0,
          "empty": false
        }
      })
    )
  }),
  rest.get('/vsm/user/getRoleInfoByTenantId', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1690232054247,
        "result": [
          {
            "id": "695681175749922816",
            "name": "QA Admin"
          }
        ]
      })
    )
  }),
  rest.post('/vsm/apps', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1686804011185,
        "result": {
            "content": [
                {
                    "id": "641324847992934401",
                    "createBy": "swuadmin",
                    "createTime": "2023-02-23 23:28:20",
                    "updateBy": "swuadmin",
                    "updateTime": "2023-02-23 23:28:28",
                    "delFlag": 0,
                    "appId": null,
                    "appName": "ICMP",
                    "appDescription": null,
                    "tenantId": "625033608159039488",
                    "tenantName": null,
                    "apps": "641324689842507777",
                    "groupName": "AG_Product_Team",
                    "matchingCriteria": "ACL",
                    "appPriority": 10,
                    "appEantryList": null,
                    "appDscp": null,
                    "appProtocol": null,
                    "sourcePort": null,
                    "destinationPort": null
                },
                {
                    "id": "681229425206890496",
                    "createBy": "rotemsuperadmin",
                    "createTime": "2023-06-14 02:14:53",
                    "updateBy": "rotemsuperadmin",
                    "updateTime": "2023-06-14 02:14:53",
                    "delFlag": 0,
                    "appId": null,
                    "appName": "My video conferencing app",
                    "appDescription": null,
                    "tenantId": "625033608159039488",
                    "tenantName": null,
                    "apps": "625033608473612289",
                    "groupName": "Default Application group",
                    "matchingCriteria": "ACL",
                    "appPriority": 10,
                    "appEantryList": null,
                    "appDscp": null,
                    "appProtocol": null,
                    "sourcePort": null,
                    "destinationPort": null
                }
            ],
            "pageable": {
                "sort": {
                    "sorted": false,
                    "unsorted": true,
                    "empty": true
                },
                "pageNumber": 0,
                "pageSize": 10,
                "offset": 0,
                "paged": true,
                "unpaged": false
            },
            "totalElements": 2,
            "totalPages": 1,
            "last": true,
            "first": true,
            "sort": {
                "sorted": false,
                "unsorted": true,
                "empty": true
            },
            "numberOfElements": 2,
            "size": 10,
            "number": 0,
            "empty": false
        }
    })
    )
  }),
  rest.get('/vsm/apps/options', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1686804011181,
        "result": {
            "dscp": [
                {
                    "id": "219612545957236736",
                    "name": "0,CSP"
                },
                {
                    "id": "219612545961431041",
                    "name": "any"
                },
                {
                    "id": "219612545965625345",
                    "name": "8,CS1"
                },
                {
                    "id": "219612545969819648",
                    "name": "10,AF11"
                },
                {
                    "id": "219612545969819650",
                    "name": "12,AF12"
                },
                {
                    "id": "219612545969819652",
                    "name": "14,AF13"
                },
                {
                    "id": "219612545974013952",
                    "name": "16,CS2"
                },
                {
                    "id": "219612545974013954",
                    "name": "18,AF21"
                },
                {
                    "id": "219612545974013956",
                    "name": "20,AF22"
                },
                {
                    "id": "219612545978208256",
                    "name": "22,AF23"
                },
                {
                    "id": "219612545982402560",
                    "name": "24,CS3"
                },
                {
                    "id": "219612545982402562",
                    "name": "26,AF31"
                },
                {
                    "id": "219612545982402564",
                    "name": "28,AF32"
                },
                {
                    "id": "219612545982402566",
                    "name": "30,AF33"
                },
                {
                    "id": "219612545986596864",
                    "name": "32,CS4"
                },
                {
                    "id": "219612545986596866",
                    "name": "34,AF41"
                },
                {
                    "id": "219612545986596868",
                    "name": "36,AF42"
                },
                {
                    "id": "219612545990791168",
                    "name": "38,AF43"
                },
                {
                    "id": "219612545994985472",
                    "name": "40,CS5"
                },
                {
                    "id": "219612545999179776",
                    "name": "46,EF"
                },
                {
                    "id": "219612546003374080",
                    "name": "48,CS6"
                },
                {
                    "id": "219612546003374082",
                    "name": "50,CS7"
                }
            ],
            "proto": [
                {
                    "id": "219612546049511426",
                    "name": "TCP"
                },
                {
                    "id": "219612546049511428",
                    "name": "ICMP"
                },
                {
                    "id": "219612546053705728",
                    "name": "UDP"
                }
            ],
            "acl": [],
            "apps": [
                {
                    "id": "625033608473612289",
                    "name": "Default Application group"
                },
                {
                    "id": "641324689842507777",
                    "name": "AG_Product_Team"
                }
            ]
        }
    })
    )
  }),
  rest.get('/vsm/trustPolicy/getByCondition', (req, res, ctx) => {
    return res(
      ctx.json({"success":true,"message":"请求成功","code":10000,"timestamp":1687139632298,"result":{"content":[{"id":"1676590717084","tenantId":"625033608159039488","type":"1","name":"ICMP_Internal","description":null,"clientId":"1676590716791","action":"1","priority":"10","sourceMatch":"Client Group","sourceName":"1676590716791","sourceValue":"Product","destMatch":"Client Group","destName":"1676590716791","destValue":"Product","appMatch":"Application","appName":"Any","appValue":"Any","reflexive":"Yes","clientname":null},{"id":"643226103145566208","tenantId":"625033608159039488","type":"1","name":"Product default trust policy","description":"This is the default trust policy","clientId":"1676590716791","action":"1","priority":"65536","sourceMatch":"Client Group","sourceName":"1676590716791","sourceValue":"Product","destMatch":"Client","destName":"Any","destValue":"Any","appMatch":"Application","appName":"Any","appValue":"Any","reflexive":"Yes","clientname":null}],"pageable":{"sort":{"sorted":false,"unsorted":true,"empty":true},"pageNumber":0,"pageSize":10,"offset":0,"paged":true,"unpaged":false},"totalElements":2,"totalPages":1,"last":true,"first":true,"sort":{"sorted":false,"unsorted":true,"empty":true},"numberOfElements":2,"size":10,"number":0,"empty":false}})
    )
  }),
  rest.get('/vsm/trustPolicy/selectOptions', (req, res, ctx) => {
    return res(
      ctx.json({"success":true,"message":"请求成功","code":10000,"timestamp":1687216631342,"result":{"app":[{"id":"641324847992934401","name":"ICMP"},{"id":"681229425206890496","name":"My video conferencing app"},{"id":"Any","name":"Any"}],"appGroup":[{"id":"625033608473612289","name":"Default Application group"},{"id":"641324689842507777","name":"AG_Product_Team"},{"id":"Any","name":"Any"}],"clientGroup":[{"id":"1676590716791","name":"Product"},{"id":"1676590716792","name":"Operation"},{"id":"1676590716793","name":"Business"},{"id":"1676590716971","name":"Develop"},{"id":"1677753275375","name":"OT_Engineer"},{"id":"Any","name":"Any"}],"client":[{"id":"641039896915480576","name":"UserShawn1"},{"id":"641039988355502080","name":"UserShawn2"},{"id":"641084275151605760","name":"EngUser1"},{"id":"641287557778247680","name":"rsalomon1"},{"id":"641289585942335488","name":"Mobileuser1"},{"id":"641308825093148672","name":"UserShawn3"},{"id":"641308894701817856","name":"UserShawn4"},{"id":"641345413294592000","name":"Gavin1"},{"id":"642528240178565120","name":"lihaiyan1"},{"id":"642528355727446016","name":"lihaiyan2"},{"id":"645297265308602368","name":"weidong"},{"id":"645445092592586752","name":"guokaixuan"},{"id":"646406472585973760","name":"UserShawn5"},{"id":"Any","name":"Any"}]}})
    )
  }),
  rest.get('/vsm/trafficLimiter/selectOptions', (req, res, ctx) => {
    return res(
      ctx.json({
        "success": true,
        "message": "请求成功",
        "code": 10000,
        "timestamp": 1688033307458,
        "result": {
          "app": [
            {
              "id": "658102101884276736",
              "name": "testgkx"
            },
            {
              "id": "Any",
              "name": "Any"
            }
          ],
          "clientGroup": [
            {
              "id": "1683873057551",
              "name": "CG-QA"
            },
            {
              "id": "Any",
              "name": "Any"
            }
          ],
          "trafficProfiles": [
            {
              "id": "680935593374388223",
              "name": "test2"
            },
            {
              "id": "683472110202392576",
              "name": "TestProfile2"
            },
            {
              "id": "683472296995721216",
              "name": "TestProfile3"
            }
          ],
          "client": [
            {
              "id": "669335187091361792",
              "name": "QAUser1"
            },
            {
              "id": "683766168061743104",
              "name": "testgkx"
            },
            {
              "id": "683774935935488000",
              "name": "QAUser2"
            },
            {
              "id": "684302912934907904",
              "name": "AlTest"
            },
            {
              "id": "Any",
              "name": "Any"
            }
          ]
        }
      })
    )
  })
]