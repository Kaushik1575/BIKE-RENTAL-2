const XLSX = require('xlsx');
const path = require('path');

// Vehicle data
const vehicles = [
    // Bikes
    {
        id: 'BIKE001',
        name: 'Royal Enfield Classic 350',
        type: 'bike',
        price: 800,
        image: 'https://th.bing.com/th/id/OIP.fmtmQhbVFVHhI7WMxnlvigHaEK?w=295&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        description: '350cc, 30 km/l, 2 Seater',
        status: 'available'
    },
    {
        id: 'BIKE002',
        name: 'Bajaj Pulsar 220F',
        type: 'bike',
        price: 600,
        image: 'https://th.bing.com/th/id/OIP.7Zm0GaULYSGXFuDG3S-lggAAAA?w=335&h=171&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        description: '220cc, 35 km/l, 2 Seater',
        status: 'available'
    },
    {
        id: 'BIKE003',
        name: 'KTM Duke 200',
        type: 'bike',
        price: 700,
        image: 'https://th.bing.com/th/id/OIP.R5OVxBrMk5lymJUUaQw2MQHaE8?w=300&h=200&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        description: '200cc, 32 km/l, 2 Seater',
        status: 'available'
    },
    {
        id: 'BIKE004',
        name: 'Honda CB Shine',
        type: 'bike',
        price: 500,
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAsJCQcJCQcJCQkJCwkJCQkJCQsJCwsMCwsLDA0QDBEODQ4MEhkSJRodJR0ZHxwpKRYlNzU2GioyPi0pMBk7IRP/2wBDAQcICAsJCxULCxUsHRkdLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCz/wAARCADzAWwDASIAAhEBAxEB/8QAHAABAAIDAQEBAAAAAAAAAAAAAAUGAwQHAgEI/8QAShAAAgEDAwIDBAYIBQIDBgcAAQIDAAQRBRIhEzEGQVEUImFxIzJCgZGhBxVSYrHB0fAkM3KCkqLhQ2PxFiU0RFNUNUWDk6Oywv/EABoBAQEBAQEBAQAAAAAAAAAAAAABAgMEBQb/xAArEQEAAgIBAwEHBAMAAAAAAAAAAQIDETEEEiFBBRNhcYGx8CJRkdEUMsH/2gAMAwEAAhEDEQA/AOt0pSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgUpSgVVfF6NLp2ubXIktLCxuocYHTf2tmLgkHnC47Vaqqvi2eO0sPEs0oysui28ac4DOLp4gM/ORfxoNzwvqsmpaLZ3F3IntKPJaTsdq9SWI7Q2PUjBPzqe/vtXCLG69s6RiRligN2yIZN24uVDOvoeMds113w3ftfaZbmWTdcW/0E+SN52/UZh+8MH/0oiapSlFKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQK17qxsL1VS8toLhFPCzorr3B7Nx5A/d8K2KZ+VBzjxdb2Wn6to7RRRQxS6dJCI41VI/oJMhQqjH2sVJeBuoDrcbjaYHsUQOMSmKWH2qMsPTDDHrg158fm2K+Gllgjlb9YbhvGcxBolki9cPkZ+VSM4i03xZpMkZjSHWtMm0+aMYUCawYS2zAD1DOg+QoizUpUJrHifQtCmtbbUJplmuY2liSG3llJRWCbjsGO9FTdKirTxBoF7t6F/EC31VnD27MfQCdVzUoCCAQQQQCCOQR8KD7SlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKBSlKCM1zUZdL0y8voYTNJCIwq4yq9R1j3uM5wucn+Q5FGv/ABnrkVrNbTI9rNKOmlylv/iEZiDlF5T4duBzXSyqsCrAFSCCCMgg9wQapHjO+htbWSwMdtDZBImYSR7VuJA28WydMggHg5x38xjkKMlxq2qTTLcahIWjISCbVbi4FvG8Tb2EUhD4ctgfVx7oz8JXUNfK3Wgy3N4Ly60iO0muri3GI7kxTNJMYlKqcgYU5Ucj45MK84ZVitbSQBcKrCORh7nDAyMOcc5xn+saiFtReJsE3MG47ZUAhTp9XrSOx27eMk9vjxzUdn8P+JrXxDNqsUFrPCNP9mVzMV99p1ZsBV5GMfnW3rmhafr1qLe6DJLEWe0uoeJ7WUjG6NvQ9mHY/wAOYaLcPobweI4Paf1beXbWexRHIt0sZAnEjxgJju1uRk5Rg3rV6vPHnhm1uHto/bryRDtJsLbehYAEhXlZVOPPBP5cRXP7pdc8N336v1H/AMTJt5wC1nfxg91VuA3qO4+/JsGka1dW7A2UgXcSZLGdibeX4wseVb++a8+IPFVjrenXNkmjT7DIidTUFt3kjmxlRAkLv9J8dwwOT3GalaQ6khigSa0e4ONsM8jIST2hE4BTqD0IHfGc8VUdp0zV7LU0YxFo54+JreXiWNvl5j0NSNchttXkt5Ea+W50+7t26cd66NJAjDjp3EkYyB5e8Bj14romi63HqUfTl2JeRqCyq6ukqkcSROp2lT3BBOfu4TAmqUpUUpSlApSlApSlApSlApSlApTNQmrapJYXVrEyyrFcJiGZdnTacFt0J3D62MFc9+cc0E3SqTc+Lb/T7hHltkudOkZVZ1+hniYjGGOSnyzgH1HnaNN1XTdVh61lOsgGBIh92WI47SIeR/D4mg3qUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUyK1Z9Q062bZPdQpJ+wXBk/4LlvyoNqlaB1fTNu5Znf0CQzEn7ttYv1t1Y+pbWssmJAro7xQyrHzl9kh/AUEpWrdadpl60LXdpbztC26JpY1ZkP7pPNV7UNelhcqj6tB7zHJ0y3uY8N2A2ODgV6tPF+mMYY7h5UAQrNPc25tyXXA3CPLcHnODx/C6GW/8Lwy29zHY3EsDyQzRIsh3wYcY2HA3hTkjjOM5xxg1PVf8Imow3OmTWDobW70+e7hMtkkyW6WUtm95Ejr02Cho2KgeRC4wekW15Y3idS0uYZ0wDmF1fGe2cc1nIDAggFSCCDyCD3BFRHJNEvrO6tjpV3chItQhCqxKyacLwZYrJCD7u4jcGTZhlJyVbmp6ha3Omao9vObeWWAxOksL74JkeMSQyK6AZ3A5H/bmf8AGOnX9vrN2wsYraKRd0UloqJbywbiEO1B9ZeA2RnjPY1X7uR0tNJj2rcSQpIZbjpyie1j3gLZtglTGv1oj+8QMBao2YL2BzAs6kLET9HKzNAytyVx9nPqBVlTw/Z6pb9bR51mIQ77N3RZ4xjJUK3BHpyQfJj2FQg2ThMEYcssbYxl1+tG3ow7j1FbUbXGnkXEU5g2EYYN7pJPAwOc/LmpNd+XrwdTGPxasa9fG/z7pWS5vbdjb3zXENxF9DFfJvS4jC8CO6B5ZR5FgT67u64rXU76wmWYLGDBIQZbVBFFI2eeokY6Yz3DouD5g53LsLrK36Ri/jEgcY6i4zz9uNiPxB4PfvzXhtLjtJVuVV5LFkfrSWzyxSxoeeuQu4EJ3dSje7nuBkvPq7ZumpNfe4J3Hr8HVNC1q21qzSeJvpFwsyHAdHHBDKCcH15+8g5qXrmNlZ6v4bvbK9hhheO9OwxWlwrWt9AoDF4i3COAcoM4PbI4A6arblVsEblDYPcZGcHFHz32lKUClKUClKUClKUChpQ0FY1PxJb2Woy2U0eoQrGqDrosbW5ZhuHAO7nPcgdsVEax4hNxbtbIlpe204xNHdRMpA8iCjKQR3BHY1OeJ9Dk1a0MtmVTUrVHNuTjbOmMm3kJ8j9k+R+ZzyVL2SJmjuFKFHKOjAq8bg4Ksrcgg96xN4rOrPp4ei/ysU3wT+qvMf8AYWYSzwxwreDqQzqVguRiSOUY5hmx9sDv69/Ks1lHp8Ekc1rGIJoxhJ7Z5EcD0LK3I+ByPhVZL9ZCIn+vg4jb64U8EKcAkfj8PM+Y74oxXq7JFPvDJU/ep5/EV2fMmJjl1K38Q3W0dSGKXbgM0bFG+8DI/Kt1PEFof8yCZD57djfzFcwTUzx1gSfKWFtkoHwI901tLfXhGbW5E4/+m4CXA/2twfuP3VNI6ams6Y/eR1/1xt//AJzWddR01u1zH/uyv/8AYCuVJrs4ZldQGU4ZSCrD4EHmthdeH2lI/OpodSW4tW+rPCflIh/nWUEHkEEfDmuYJrVs3cj7+K2F1aAdmI+KkfyNNG3R6VQotflVl6d3KCCPddiyn/a+RU/aeIrdwq3KFG7b4veQ/Er3/jUVPUrBDd2dx/kzxP8AAMA3/E81noFKUoFKVhuLq1tUL3EyRL5bjyf9Kjk/hQZqjtR1ex07ZHKXlupATDaWwD3Eg7btuQAvqzED41A6t4w9ltL+aztmYxRkRu7AOpb3RKI8EEL3xn8KpMmrRHDxtNKtyEmupmc+0XG5Qd0kuM59BjA7Y9bEEefC2XviC4lD+0z9GM9rTT5Sox/594MOT8E2j4nzihrvSytskcCHuIFCE/6mHvH7yagZtMurxoms7+LE4zH7UpRjnttZPdYeXu+8P2D5ad1Bc2Uiwara3FrIxCxXNhMnScnsQGPRY/D3DWZyRHD116LJM6t42uMXiKX7b5+Zz/Gt1datphiRYW/1xRtz88VQks9TkybC5hvsDJi2FLtR+9bviX/iWrB7bdRM6ywSqycP0yW2H95Gw4+8Va3rJk6DqMfma7+ToM9zp3Tkk9lLFEZwtk8sUz4GdqCNwM+nH8aiLuCw1COKWG4luInX6Iyt7Uoi7rsWRRL65GPzqsjW0CsetjapY5VuNoz2FbUI1u3drprKJoLl1MsFrIm55GRZOokmWxJgjcMckHIyma3w8TPb399oF0lzYyo0CMEuBa79joMjZcQPyAPL3Rj1rrOk6rZ6xYwXtqwKyAB0z70cmOUauZ3mnW99CJJry3guAhCSpKhuYWKEmKYowBXGdwJxgZyuKgdE8SaloEtybWZWhkjeOSLhoiwI2yxbh3HOPUGpyvDf17XtYg1+8uVN7cG0uZpbE3lqkEUdosp2ApIAcBshSVycZ8+IC2uv1ndvtUwSXLy5t7bPCSEtiHeRnHoMeWPhveMNTttYvbPV7eV5OtaQx3Nu8AjjtJISQEE6gF93LeeO2fJIzw82mnUHt7+B3/WVnPZ2c8EZlnsr1sNHcRxkgEgrg89j3AJzB70u0PV1OJ5d0aiNQiEgMwZh1BkbgVxgefNZNREnRQTbt8Mh2Mq4jljcfX44DDHIz8fOpO8SRrHS/E8AimgZTDqjZYXSybulIk+3KsFYZR++Cu4H6zfLmUCGZl7qhO0HIftgAr5edbjhGtpAk6J3hDEzFozuy3oRgdh5jmpa3ubuwkVonkkgLZaIt7ynOcxk+Y7j/uQdHw/CJNU0u1uWBs5ruETRx4UN1Tt2swwQM4Jwc8fGpTWo7HTb020U2+KVHmiBPMYErxhSc/DKn0NTl1x5bYrd1U94TuTJePD18w29pPHaRDiNRNKko2KScD3SAPLt6V0CBt0a/DIP3Vybw5Fcz61YS2n/AMvKhviD7gt5Byr4+0cZUfDPlmuq2xGZQudvB59e1ZlLWi1pmsabNKUqMlKUoFKUoFKUoFKUoPlU/wATeCbTXJfbbSVLS/Oeo5j3w3BxtDSKpBDeWfxHHFsnmjt4Z53DFIYpJnCDLFY1LkKPXjiqE36SrK5Z4bCym6qnd1J2XYYwecAc5PxqTEWjUumPJfFbupOpUDVdJ8S6BN0r6zAikf3JxlrSXHmJFwA34H4Hz8xzQ3I6cqbmXgK4BYZ/Zzg4+WKsur67d6ykaXcojEbyPbC3RAEZ12kOHBDLjurAg+Y9KtJZWryLEs1vY3LDdEJZCmn3HkNkjktCx9HJT99ewVjtjUNZc85b98x5ezbRKN0U00PzbqxfeGw/5mvRTVYQGaBpUGWDxI6sFHnscK3/AEmssB8R6bNJFNZ3UbR/5ouoo+mB5FjODEynnByc+RPnKJ4hml6Iu7azu4oCxiTppEYWKlQUKjb7ucrxwea2l747R+mup+aEl1SO4QxTzCO4iVjA867ZFZRkRMwG4qe2CODisUWpRMB1g8b+uN6fiv8ASrLAtjcLJJbTsnSGPZ9TtF1GLYF4HU2FwTg8EeXxwsfPYaXMfp9OuLKRtoEmmEyRMz8qPZ5iRz+69FtgmI3E7/PzjbWWVJBmN0cYByjBsZ9cU3sOQT8cGteTQLhmZtOuYLzbzsiJgu1+cEuG/AmtNpdStHMdwj7gcFLlGVx9+A38aPPPjlLCaUeZIrcg1O6hwA2V/Zfkf1qGgvYJSEJ6ch7I5HvHz2t2P5VucVFWCHWxxvi+9G8/vqUg8RdMAJcXafAHI/Ddj8qpnI7V6EjDzoL8niq4Ha5c/wCuND/Kso8UXZ7XA++KP+lUFZmHnWVbg+tUXaTX7yQc3bj/AEbU/NQDUTcXocsxYux7sxJPzyag/asD+lYpZ2KSSSOI4UGXdjgAfGgyaheBo5l3AKwCuSfdCZyxPwAyTULBujtbYNkEx71DcFUZiyAj5YrHLcC4ZXdNtoh3RRScNORyHm/c8wvn/HXnvNzMclnY9x5k/L+VU+SwaPq9rZym21BQ+l3DfTErvNq5P+co77f2x945X3rf7BFc2836su/1nZNGw9kjureQIHHKxe1RyAA+asoHoVrlq2t3cYaZjFF5Aj3j8Qv8zUjDm2EXQkeNogAkiOUkGOc7wQfzry5L1ifD9b7M9k9X1GKZy/pr6b/NwlbjT7GSUppbXNvdQttm0nV5FFxG4H1reUgNg+X1h8QK9jU7tG9l1KFbro4VoNVR0uoVbgdO4TEoHoQxHzrUn1ebUY1t9R6WodMYhmfi9g+MV1EN33NuB9KirzUtQSKG2ubj2iK3ZjaF2WSSJT3jJJ3gHzGcZ8qzE1tOnXLi6noKd19TWPjv+J5hYn0/w/qPME/s0p7Q6mV6efSO+gXH/NB86ibzQr/TJMqJbdnH0ZLGNZFPvfQ3EDdNgfnXyw1XTWVReaZbXKgY6sLSWl4nlgyW5UN965+NWKx1HQI0aO3vNSitpP8ANs7qS3vLR/g0NwoP3gg/Gtamnq81cmDr43NNz68b+kxz9Yn5qj+tdVtsxTSsw9wGPUIo7pGCYwMzAnAwON38a0JZUdpCEEas7sqKCY4yzFtikknb5DJzV21Oz8LXAJs7xrPePeS7R2swx8uqNzpnyyCPiKq0+jyRy7FljjGGJZ2MsJGCQVeHdkH15rdcsTy8fU+yLRE26bc65if9o/uPk0o2SQRxylumkm7C/XAbG4D51gabcAixjb1lkjXJJGPshj6+de3WezuDG+1ZoiG9x1cYxuBDLkH1FeJfclWRDnJSUHGMP9Y8D4125fDmJrOpXvw3NpeRojspttY0+4u5ogSWEyyS7ioIxueHa6j9qAeuKhp4JtOa80y7Ba502UW4Zcbbi2cZgmUPjKkYwR5YqOsJ7w33h9rIA3kd5DBp4kbbGtwbgGMMxOB9YD+VWKC7tWvppry0RXkll3JKOqsabmQW4MwJAT6o+A9RXm6jqI6enfMbdsGCc9u2JaGnywW0ltPI460W5lW4EgTc2VO8EKuMHgZ+Oa93Vt7bLNcx3IaaU7pA5UoSAAADEMADsBjj7quGleD7DWIb64ivbm3RL2SCFQkckWxY43wN3PBJXv5fCs0v6ObgZMOp27ny61qyH72jc/wrvjyRkrFv3cbUmtprPoqui6r4h0a6tY4ZUFu8zCS0u3VLO46mAzLKBw/A5zxgeWQey2bKUJbCSsscksRdGeEOuVV9hI9ee1c4l8C+IoSrxrZ3DL9Ux3DKw8uOsoH50hi8d6Td2c4s79kgKwbDvuLYW7yKXBhgYjHHGAMd61PlI8OpUrDbTpcQxygFSdyujfWjkQlGRviCCKzVlSlKUClKUClKUClKUHiSOOVJI5FDxyI0cisMqyMNpUj0Nc68YeHvDWjWVhPpmnW9pd3N+lp1IjIPoWiklcFS237I8q6RXE/G3iyS/wBZe1t1ElhpUrx24MjLHLcBWjlmcJ37lU54AJ538B9aGwTQLydQHvligkllRwjpI86pJGFdWIWNcDgjuTzmqhdSkmUCcP01kO58A4VtoyGORye3xq52ElreaVIkCJJFLAkV3DuKpvYjejMxUnGPI9sHueLP4V8LWb5v7zTYIoEkjNnB0ziVozkTSLITkA42fLPzqOU3d1G/Tg23ka26JHFaztK6QKB2CzHI5yeBjny7DFHcBWUo5VsgAHjJPAAHn8q/Q2r+H9B11ETVbCK4MYYRSHck0YbuEljIcfjVai8KeBfBjT+IbmW5K2vMBvpVmWGRsgC3jVQTIey5yfljNFcvtr9WK7m6b5wGUkKT6ZHY1LQX9xFu97IdDGSAFk2N9ZVkADYb7XPPatzxLBeazp194nt/D2naXpsXSdZ55ZI9TvY3dUVzBD9FhtwIDLnHIJB5qVrf7AFkDCIt0wzA7VfGdqv2+7vWt7ape2OdwsUoSdFESwqI1KrHGiwsgP7O3C8fZrH+sb2OPpXbe0xICrpcqsjAHjILg/351gRjlSM9gykenqK9yOzDlUYc4bGGH4VymLRPh9WnU9Jek1yU1Pw4+k8x9mtd2FjeRtLZoI3OT0gT02I8l3cg1H2r3+JFjZi0RAaN3DHB4zslH3HDitthNbyma3GUYAyQ5yO2CUr2T13S/sSq3sXMkbgbZ1xykin17H1+Y56z5fHtreoYvb5I+LiEr2GcGP8ADqEp/wDyVspd2zgEvsz26qlAfk59z/qrPBe6beL78TQSZIdEP1WHcFW/v8Ky/qnT5ctE0eSTkxkwyEn12EA/jWR5AVl3AgqRwQcg/IjivSoD5iteTR5oTmOVlI7dRSD90luUb8c1jMWqx8Frhh5m2uoAT8jNErj/AJGg2Z5oLTPUDyTbS6W0QzM4HOW/ZHxP3A1oXFvrd8EnlRBEArw28bZgVe+A8ZZd3rnH8hmhS1haRpbNFZ8Nva4Yzhx574hnHw3H5+Qym+RVZA0smTlhLKQmfUopOfvpPh3xYYv5vaKx8f6QToS7KzlXB99Js9QHPYeR+eayRFY2OxJN47u8eCPkzkKKkXM137nshkX0S3d8fJiCa8fqXU5MLDZ3ig9llVenz6LORUmJtHl3x5qdNk7sfn4zH2acl6B3kUf6QZn/ABOE/M1qSXgbtHvPrcOZAD8I12p+RreudF1O3Cme0j97O1YLmATHBxzEzH8qwrptz3NvAhH/ANzcFz89luMfnWIxVh3z+1upz8y0XurmQbDIQvYRx4RPkETAr4Le4IJETY8yQFH51LJp1wAAbyOIfs2tuB+DMc1kXR7Rz9Lc3bnzJZRn8q6RERw+dky3yTu8zPzQ6RXMZDKBkcYBByPjzW1uJALAZ9GAP4g1Kx+H9Mk3AS3SH7LB0PPqQR/OtO50a/tMmCVLqP8AZxslx8AePzqucTqdw1mngH/ywBIwTHLIgPGDwDWs0gBUQ740XkKJGYA/CsUkkjuEVDuJCqpBLk5xgKOc/dXx45o3aOZXjkRirJKpjYMO4KMN35Vjth67dZmvEbnj9vEs7XEko2HpsR2IRF2/EsozWSOJ5ZLe2jtzPcTSJFDEu/e0jnCqFTuTWsuRwOPP4Cui/ot0iK71HUtXmXcdMSO3tAQCOvchi8oJ81UYH+s1eOHC+S2Se687lRoUmScxkyQXEFzG6ZBSaGVWwCFPIKtjv6VMRXOqajPKsNlMb28mJkdmcqbxtzz9MyZTGcyEZ4yeyji+eO/CFtLDda7p0UcV1GZbrVMtKfaQqLtdUyVBBHvYAyCfOvPhe1/WvhXUI7Y41C11P9Z2TMcoLsRpPHhOwV/eRx57m/aqWrFuUraazuE54Bs9TsdDeC+mSRvbbpkjBcyWxLYkhkLHGd2Tgftdzni21U9E1CMXdo6lls9biBjV/rQ6hAhJjf4soYH96FvWrZVZ3spSlBjjhhhado12meTrS8nDSbVTdg8DgDP/AHrJSn9aBSlKBSlKBSlKBSn99qGgrfi7Uriz0nVEsmQXn6vuLksxyIraMqjsQpzliQicjkk/Yrhqxz61qdw/TgthcSvdXPs0ey3to2OSIUye/ZBn+tdE8aX36xbV9P0926W6I30pbatxLbfVg3njpIc4HbcSee5++CPCEksMeoapEUtZCskFrIMSXOO0kw77PQefy4ao2/DPheK8S2uLqAR6TAP8Hatz7SBzvfPdT3J+0fh36KqqqqoAAUAALwABwAAKYxjA+HyHwFUvxV48stEaSw09EvdVXh1OTbWhxn6Yoclv3QfmR5xVo1PVNO0iynvr+XpQRDHlvkc/VjiXzY+Q/kMjiGreLLrWtatNQv7OK606wmL2mku7+zDHYzOnDP2LcEeWCODpXtxrGtXBu9YvJJ3ydvUOI41JJKRRr7gHyH9aRwW6KNibhtyTKcAnG3sOfzqjBqes6jqN3ezxrJax3SGKa2t55jE8bOZGSTsWyST72fTsAF+2Ou6/pthNpdq1uthPK800E9jaXCSu4AJfrxsT2A59Pur1KYhnEi5wciJW7/cMfnWqckH3JyPXaf60GEXd5HJJImyMO27pLGFhyfJUHAHyret9Vgcqk0bRuxABTMiHPy978q0Sy5+2vzUj8ay20cUs8O4xkb92WIUHAyQCRtzjPcj5ipNu2NumLH728UTCtHIA0bqw4PunOPu71gkhYOZoWCTDz+y49HArFdq/T9o+lWWRi8Z98EoOBtY9/If5jfd56dtqUyyLHdEdMsFaRlcmPJxlggL4HwB+RpTJ3u3V9LPTW7d72zXAErNcInTuox/iYu29O28Eenr/AD75obibarxSBl7YfhgR3XI8x8a3rzTrmGK3up4Xjt5QJLW/gKzWjKcjMdzHlMeoYL6EVFPG8OZEA5GZEQ5jlUf+LAfUfaXPyyB7upeNMQ6uyYSQsnwk5Q/f2reS6tJvroAT9qMjH4Hiq+iyyIGjQSoRuxEQ5/4j3vyrEqzbx0WEID7Zmct9EPNumBk/LufzqKtyxW8gwkkT/uvgE/c3FbMcBQgdMKfLaoBP4VWllIYrG8joCdryqqOw8iyoSoPwBPzPc+21S4QezxTSqhwJmjOTtBzhc/xqosk97bWx6R3TXGMi3g96QfF8cAfOtN5dVuch5FtIj3jtvelI9Gmb+QrRtb2CLCRqhDMWIRHV+ecszZz95qSSeCUZDhSAWbqEKABySWPGBQY4rK3TIRMu55YktI5/eY5JrTuTp8bMiyb3UHcIgGVT8W7fxrIJp9TLxWjvDp4LLNdAES3WO6QA9l9T/wCg2reC3a6g0i1lS2dgrXM6lS9ujjcqp1CN0zjkZJwoLYOADFV+5urC2BEruZPKKIAyLnkbyWAH3msMt50jLgBlieNHdZo5Y8yEgbXQfA558qy+JdGtdI1S3jWYSJMFnyC3CCVowzZ97naT598/OJu545YkiXYZJLlpGIVQ6qikL9UA87jQSg1IRyRQiNmllMSIsTKy75CAAzE8EHvW5FDqb6xo+m31qBHfalbWw6NwDFND1MTASRYkGB2++odZrVtYe9Bcw28kNzhVTLHKrt2yAp6+XlVu8Kzwap4u0qWVspYwXEkAMSRGS4dSqhh1GBIBLHb6DjFBcfEeiaRpHh3WJtG0rSLedYQWlMbRSiMMCTHNDiXeOCg3Yz3788VW6uE/WRJiuHvYfZ55p160oXqLIXikckhiQATz91d78Y6TFq+gajCUhM9vGbq1knkaJLd0B3SlkVjwu7I2nPbjORwCWNI0gQZ3yqLg9srG4+iXg+Y94/6h6UViUFiqqrMzMqqqKWZmY4CqBySewr9A+CtCk0HQrW3uFC3tyzXt8AQdk0gAEef3AFX7jVQ/Rz4Swy+IdShfIwdIjlUBSGXm72k5z5JkDHfzBHVMY9ag172AXNne2xGRcW88OO/10K1z79GMpQa5aNwyLatj4xSTQn+C10muPWerxeENe8WGWFpQJL22gTIRd7TLcRGRieF2k9sn4VRbtQtBBqOo6fFLHG19t1vSyWGbe9jkBckDkLvCt8nk9MVi1T9I2iaXHCjW11NqDRK81qoESwSYw0byP6HI4BrnknjTWL7V4by5uRH0pE6PRgjZY49xRlRHGCNrMPeJzuOcdqjtbS6d+tdSde5d2a5dpFmfqk5BMiErgjGMY7/CrpFjvP0reIpSRZ2en2qeRZZJ5B82Zgv/AE1Ht+kDx7IyY1ONA3OEs7QBR/ujJ/OoS009mkbqxutw+ntqWlo0QaO9SPeXA3EHkK5UjzQj56zezMNyZjJGdhbfEc85RvrD78/OroWuLx/43jI3anbyD0ktbXH37FU/nU3ZfpL1tSovLDT7lPM20klvKf8AkXX8hXNAU/vFegASMA5+GaeB3XTfHfhm9McdxJLp87kKFv1CxFj5LOpMf4kVaVdHVXVgyOAyspBVlIyCCOK/NMMt8nurvZCQCkil1OeBwRmrz4HvNTF/bW9tqlrZWrzqJtPvDM8VypwzCzRhtWQ+WHHrggYqTEDr/FKD+tP77VlSlP77U/vtQKr3iXXRpkHs1uw9vuI2KnIxbxdjM+fP9n8fLnd1vWLbRrN7iTa0zhltomOOo4GST+6vdj/M81nQtButWnOta0GeOaRbiG3lXBuWGNssqntGONi+fnxwSMXh3w218Y9Q1KM+xBhJbW8oObtwciecH7Hmo8+54+tfuB6UAwP6VC+JtbTQtKuLxdrXMjC2skbs1zIDgsP2VGWPyx50Fb8b+Lp7HqaJo8n/ALykjze3CtzYxuuQkZH/AIrDkfsg57sMczigihBJG52zyx7kkncfPnPIrIvUYyTTu8lxO8ksskhy80sj72dz5knn78V4cgb2fjHvN/f8P7xR6Zhk4AJC984RfUn+FYXlTYJXYGNn2LNN1Ety4PvKm0ZYjPOMVlgtHv473bII5IrR7izgdJFa8C8yCBzhC6rlwATkDAHGa6/4e1fwtr+m22nRwWoVbUI2nXESGNo48I7Qq42ugPcjt5gE8hT9C8F2uswrOPE1pLHgF4tFiTeinydp/pB96Cobxf4cn8LmykW9hu4L6SZIVlE8dyoiUElgshQjkAkY7jjmtvx/oOn+GbvR9S0Qy2Ju3uUZLeWRBFNEEZXhbO4ZycjOOBxVM1PWdX1doZtTu5bp7aAW8TyBAVjB3Y90AEnzJ5P3UVZPCfhq58VfrNhcGyhslhjWYIZ0muJMtsKyN2AGTg+Y9azW/hjUHhv7jTby1vYY5Gt5JLdmt1dU3PJIYLlUPuY594g+WewvWl2sfhPwba28lw1pqF5H1JJI4FnnF/d4Y7ISQCYxgfJM845hNWivpPZrF7PS31vU5RZWuox3EZ9qxia4klVEQZI90+7juB355Xn0e3pK+e7j8+n3UGd43kZoxEYF2pmBXTG3gEo2O/c+6K1JIUkLY/2t/Wulx+BLbWLG41ixujZT3jPNpdqiKbGO1U9OJJQwMh3gBid3G7sce9Qbm3uLW4ubS6he3vLZuncQP3RvJkPYq3dT8R863WNQ4Z8vvck2/hu+FPFV74YuzDMHn0e5fF7a8NtLcGeAHjcPMdmHHcAjqt34S8Ia7bx3lpEkAuo1nhutMYRJIHGVcxY6Z/45+Irh8qAqfX1z+XrV1/R94wt9Hj1DS9VmKaekNxf2TtgmKSMGSWBcn7fdR65/a4rig77Rb3RdVvtNun2PHtmttgEiTQMSBMrcNz2I8j619EUshG9mkYDg7ix/Bua29MsPEHjrxBq2oCUW7pG928sis8NuSuy1s+MHBH1uOwJ7nnxbdKZgs7G3McrwXQwWaCWNtjrgAngg4OKqNWcSJiKGOUyYw7iNwE/dXIGTWGOFgdpUg54U9/XJqwjSLiV4ltLuyuC5OR7THG0YCs25y52kcHtznyFRvfknuP75osxqdS+RoEzj6x7nzPyrDdTNM5sYm2ou17txjhc5EYP99s/Z52owA6lgSu4bgrbWK55Ct5H0NY9Qt7OyilvLeSJLZ5FHRZm63VKgbUzliSBkg8d/exxRH0X81uYYrXprK7pFEJAeih7FnUA+4g95vl+9Vl/WFuNMPh7RrC4uWlf26+uZIuve3kwcSSXMkMRIUMQBln7e7jjmm2FxMJ7e4gsba+kuLuK1t7S9/wAh1IcKbhQwyhf3my2PowDwObhb6bqGkwa/etqelmfUIJYr6GBTZRAyOG6VrcQtvDc7Y/cA57HNBR9Y1CbWLxbmSWaV2jVWlumUFveZsjgALzwMACte2ihFxbzXMQmgjMrSqFLozKhCxs0Tg4zz3H5c5deitbPULuG3kumjVQ/+PSOKdJWXDRssYCe6eAQB8qx37FTYWsLe9bWVvboVOCJZT1GwQfUj+nqVqICGZyWDHJIye55z6/lUhpt/NY3ZlS8vbSTaYTPYCNrheoQWx1COOOeQTjGeedhbJ9T1mDSLU43zQWgIYnplUHWnZjk8AMx+XYV0fUPD36Lt9hAsSyXFoSfY9DMlxcXnn07pLYMxGecllx64qD7afpAsTpl0usWVwk0NhL7x2yw37JHt2t0xlGk9CuOTzxzz3w7os2s69p9pcqBJdSe2XkSjC21hHh33L5b/AHY0HkGre8RfqrStSt7a1tGso5l3yWJvRdvZ7ZCFM6gsiu3B2CRgoGe7e7Z/0emwtdY1aFo/8Xf2sUtvOWJ3RRMWki58zkMTnnHw5DpyqqhQoACjaoAACgcAACvtKj9Y1O30jT7q/mwRCuI0yAZJm4RB8z3+GfSghvF/iqDw9aFInVtRuFKwJwenkfXK+voPv+fFJLubUf1ibiTqXc2boszF2Zgd3LHuR5/OtnUl13XJptbm2S+1SyJbguqN0090tEjcbfIc1E9DU7R45/Z5EeNgUZgjqT2wdpII9a3CMtjBazJO08vSC790m1nMaiJnXCLyd7bUz5ZzUhbyG90+4gMjNLbFEyTyISoEXHoCNp+a+tapthcq1xZ4iZvduLZ85RmON0fqM1vmG8tpLXUItHuYNJt4I7K+uo4ZjbzqcQyzvK/u793Pce8vagho7m8gnt7mKVlurWSN4XY5MUkTZQAHI2/DGK3dStl69tPZxStbaokdzYphWkZ5W6UkCrGAMpJuQDHp61tTaP1rrUokaQ3ZtHurGKJQyXctuQ80QGN25o8vHjvtx51bP0eeGtUlvYtV1O3misdMM502C7EsTG+lCBp0hkUe6B547477ciSKnL4e1nTkSTUNNv7cO2zqSxDpFz2UOCR8ueaxqi8YIz5evy/s13bxEkL6FrUUyB0ms5IAp85JcRxn5hiCPlUQ3hvQL/Xb6O5s45IbDSNLgjhAMcZeRrgGVhGRlgFAB8qmxydWZch13AKTgcMOe+e9ZwsUikjk7o23AZeNkZcMVHcDHkM8/eLjr3gC5tVe60N5LiFMu1jKxM6jz6Enc/Lv8+1UeNsMdu5ZFbaykbWDdtrL5HPHx7cGg6F4a8XSQPHp2rzF7d5I47K+dt2xZF3JHO57jyDZyOM+o6Jn+81waORJEOQSm5ZJo1XlSrK5kjGODwN4x2+PfoXg7XWYrot7JvdVlbS5vKW3jP8AlAnvgcofNR+77wXelKVFVKz0XUtW1A6r4jt0iWIqllpokSZECch5mQlCM8gfj2xVsAxX2lArkfjzUTqGuLYxsfZ9KiEXunj2mTEkjDyyBtH3H1rrTMqKzucKil2PkFUZJr8/y3El3c6hfPnqXU01y2f2ppC+Ae3Hl/3ogctsKqCciOEDuXY4H4dzW/o2n6dPqlt+vJVg0u1HtMquGf2yVcFYiIgx2+bZ8gR9qtGGQLPbvx/hysnbA3vxkj5VKSTIUxke+MCqOo6hdeG9Q0i8ZzFfWMUQkeOzZXlj2kBWQKQVK5BzkbcZyAOOYx23hpLs6VcazqOkm2nkvbKeeNYRDLKAMXETAx9TAG2SKUKw8s99dVUEshKkg+8jFWHGO681qTSqIY7G+hFx7PkWMzn32tj3t2Y8+79nPy9DQZb/AMRarHLNbpq0usWcbDpfrnTLZ4ZyOG+ivFeQf8xn0FQlvdWsNy9zLp1m863cF7ErmSK2iCSdTorbROEMZOMg+mM1I29vpGouYJdQfTzlWjuJEOwrwrW13tyR2zHJggZKsMYNSGt+FXtPZZ9IsNYv7CVJ5J2tjBcCFQy7BBcQmQscZ3ZTGe3opW+3ji/1Z4o9Vg0YwW86TxW0kNwIZ7pMhA7kvxyT244yTnFQl9qfS1LfpqJZxW8EscKWwDRdMI8c00bP5uSQMBcDHpWe0ttAbR2JtZbjU7E391O0jRgkTMsKCaNcOBGDuGU4Yegwa4yCITHlRNKqxqzFiqN9IwLHuew781zmm53t6q9R245pEef3Sq+MPF0cdvDHrF3DbxLFCqQR269KFMJtT3PIduayatPPq/Qvo5555LWBYFa5k600kC5YmR8AE8nPHnjsOK4AWG34EfP0wK37NdRtLdb14ZVsTJ01kKsV35+HAHlk9+1dHlazujAsSPXJ7/H/AL/96xLG/UibZglsqjEh2AGc7RzirHDp8eIdXkt1FhPOLVZJFYK10V6gEJ7ds+mfU9jpWE1u15dqNhcyOYJfrbowSVC8dsciiNK3uNatA62t7d2wkfqutrczwbpMY3MsZHPxr5DPqUEnXCtIzbhPvLN1gWLZcnnPfnOf4GxDq+ikf7fzyKYHZolI8/cQjPp2oMME8dwgdMAkkFZAQyuO6M0YIz/t/jxnCSH/AMNyBjmPbKv4Id//AE1juIREBeQR4CKi3kCLjfEp4kjUfaXk/iPPjKzIsQmQrIhVWjZDw4bGDkjgevp91B9XOcYJb9nBDH/YwDflUJrFzLLcpZxE/Rg2+Bn3ppSN4IHx2r/t/GVvdRlgtcRytvdmCskjFVCH66MPInsfhUHZpC5mvhOGnthczC2dHL+5AWFw0mNmCxwBknz8qCSsdV/VVw0MV3dRQo9lblLZIWjkt42KXEkhJ3FuSyADuOe2K3/EFzKJ3/Vur3FzptwkFxah7nMjhGHE0ccYjLBwWBLZHwIwImw0+K6e2so8iXoR3F9I3JZ5V6m1j32qDyARknGfeyNm/tRbyqgd3VFVEaQ5IRRgAAcAegAxQZYry2jMdxNZrfX15Huu73Up4JoTMXZiqB4CVb1DHPxOa29SupZ2E9no9gJZbRhen2HTdqsMKDp1wiksxUZ8iMceeVvp1nqNpLFnpXJQCOVCQCw5VZVHBXP9+ujBps5UPY3jWtwNyzQTt9D1EOGAcDtkZGVPBHpQb/he88MwX19Nq8CXlqtvCI1nWIvHO4LkC22jcTjBJPHHk2RI6r+kSZraS08Naamk20mVa9nSFJgvGehBD7gPxy3fy71WjJM8cYu4UAfVUu2aCC3Md17gjcoW2yEHaMqDtwzNgZ5idQbrXF3dJFBCs00jC3h4S3Zvf6SoTwozxziivS3UbNcrJbiee5WGO3mZj14ZlZm6u4hmJYtubHJI7+Runhs3VvrXhZXR45o782bhipZh7PNHJkL/AHxUDpsOix6rBeWbTS2tlbRTxJd+80moBeze4o6aMQx93nbtGc5Fz8FWcl/ri3p3G10eKRtzc7726QxgZ9VXcT8xQdSrlf6RNRlv9U0/w9byFVTDXLA8I8qb3c/6E5/3V1KSRIo5JZCAkaNI59FUbia4Ct5Jfahr2sS56lzO8EPP1RK3Wkx8l2L8jQbFzPEgxEpWGJFhgjXyjUYVPTPmfvqHfNwzvKTsRcsfJQOMD+H3/hmmk3FvRcqBzyx7k1MeHfDs3iK7eyExgtLaKO51GYJvYmXIjgjB93JGSSTwCfOrtEr4J0TwxqcWqJqykahPsjs4JpHt5EtGRWWe0B2sSTnJAPYeTYM9ZQww6zrvg09SbQ57LooszdR4JpLZZ3988553fMipHV7eXTNNH6yjstc06LpQRxX8UUV+rviKNYmRSjEnH2VPnk4qnQXB0OG/1D9ZS2+p28lpC0EtqJZp7q7Aa5ijt7n3wkQ2AENn6PuQ+0wQrQX9kXgLquq+Hb5bYSjBy1u3UtpT8CAAfgMV2rSNRg1bTrHUYRhLqFXKeccgJWSJvirAqflXDupbJqV7d2jXculzSra3M99u67LcHK3Eu/3iBJnk84POM82fw1qbWE82lTrPLBdTFrWGBAze2Mu11Us6ABgA4ywGQ3rRXQ9cJaLSrbGfbNY02Ij1WKX2tu/wjNYtPbd4h8Wfuw6Gny+inf8AnUIfEng0XHTna7tLrTZWTp3kUqFLh0Kj6RSygkZwdwGCe/lv2F9p8F/ql7K7K2ojThI3Xhmtx04THG0DRgMQR9c84NBZ6oXjfwqt1FNrWmxqL6FS97Cq+7eQgYZiB9oDv6geoGb4CCAQQQQCCOxB8xX3+NQfnuK4dWS6jJz9vdg5AwuW+IOAfuPnUrBM6gNbP057ZTdacw52yh490QPc4IXYPRm9KyeLNJTRddnSJMWV+hvbVR9VSciSIf8AUMf6fStCykaLdtwz2zi4j5IZ1jyWUEc4ZSQfnVR2zSr+LU7C0vkwOunvqDnZKhKOmfgQRW9VM8E3AjbV9O3Aojw6hCQNqkXQLNtXuB9U4/eHrVzqKUpSgjtckMWi67IO6aZfMPn0XxXBkJCMC3GUHcc4HfNd51yMy6Lr0YGS+mXygep6L8VweMqUY85yp59NuKqPCkgjkktcqv3KjH+VbaszDJPbIAqPLYCNj6l7CxBAOQd3GDxXYLrwH4fvAZ7SW6s2mxKBC6yQ+/73EcoOBz2DCg5ksjjH8K9SGOZCkq5HkQcMpHZlPrU1f+Gbq2uru1sbuPUWsoZbi/aCF40skRDJtncsydRh9VAS3mQAcmvo6yRpMhzE5wjYKhj3wN2M/dQa8sAByyk4/wDHiBDD4uo5/DNZbK81jTH6+mXssecEtbSbdwHk68ofvWve8HsefgaxtGpbepKP+0vY/MdjQWKDxna3uyLxLotlqBAK+0xRpb3yA8Eg8A/7XX769/8Asz4M1gufDniCbT7tzuOn6qC0bP5LiXD/AIM9VZj9meMMP20GR/xrwYFIBjcMo+qr+8o+XmPuNBP6t4L1DTbG2li0/UJ79Qi3bWvSns2A3NLOjptKAcbQU9cn0i7vWtSXRToaz2stiHEKSiOQSSRRHqABDyFJPcjPl8azLqVxLAlpqNxqT2yKqIou55bdEXspgZ8YFZktLaWJfZjZzxqNoSMpFIo+MbEGggrLWbzT4Lq3CQTQXUBgnhvFM0EgAAicxEgbo/sHHzzjiPjyCriQB094PvAIxyPSrHLoqSA/RSRnOSMoR8+GrTOkTQElAp5B96Necc4LMDx8jRSPVZgF6lq7HHLRSRsp+IBNZl1ZSSPZZwQMnJjA49CCa02jlVyjJYWyncwluTO0fHxG45+AWsEiotwY0vBJEST1Uh2RnIB91JhkDOQM+nxoiV/XSRnBtrk8ZJVQ6YPGCe1aSaskDTrDBIIGJlhinYAxuxO7BUfVPfHrn1rXkWaOPqfQyAMPckgiPBHcALitWUxu7H6NcEkCOMKuO/CpxmgltSksXs9LuILt7nUZo5TdxRxlIrQuwSOJFOSWHPI75+GWxxQSWtpeQurxzJZXxuo3BV45TJHCUkU8gqABg/H1qKkzsChsHcGzgg5UZGPPPpUxsDQ3MkbllurPp/SYyXL9Y5cE53YAySTk80GXT5Tb3l84YKzxQFW4/wAt1U8Z48sVINbzXX0jOrA9t3H8KgFtbshWi3SIqlE94CRVJztw+AR99WG0uXihVZYLlSq8/R7gfkRxR0pkmkaj7Nq2t5Ic+8BnHCZHNfOnETPMxABlfnOAQMDOfxrSl1As2IxKPQFQCT+9k15S5EahmheTayorF42Cu5wAiqWbJ+CZoze835er7bJ7HCrSBZLk3PVPGyOCNt7x7ufMDOPMd6gLl59QuYitvDHLKkSlLaPpRqqIIVZhzyQu5jnksT8pu9eW2dXvrG6/WM6vFb2N1FdQRpbNGSs8k+4BiGKvtx379gDjtLSdGgt4ka51C7dYUVcb5ZG4CjPAGBzzwB6CjLPpmmXNxNZ6Tp69S5n4LkHpoi8vPIR2Rc/mB3Ndr0bSbTRbC3sbYEpGC8kjAB5pm5eV8eZ/oPKtDwz4cg0GzO9ll1G5CvfXAHBI5EUWeQi5OPXueTxYKghPFl01p4c1+dThvY3hU/GciH+dcPtyItOtf2pRLcn1JmchfyC11H9It6n6ttdIRsT38ySPg8pBESdxHz5H+g1y6aSNpYYYxhVIAX9iKNdqD08h+FUfFXcYU595xn4gmur/AKObQR6HcXpA6mp39zOT/wCVEehGPkMHHzrlqrloznsJufMbQK7L4JVV8LaCB/8AbyZ+fWfNB58Szw2t34UuLzI06HU5ZLhjkRpOLaT2d5D2wD/fFU/S4U8RT69fTJprx30jWk0DSyC5juGVJS0QlwoKAE8Z78j3cVdfGELT+HtTRIg7gQsje6WhYSL9KgbuV9M89vPBitJltjbadYx2ksNxaWERlMsMKDexMMhjZO+SG3HPPrxXDLbXh0rG1B8U6TLokGj2WxEhl06aCa4tpm6d/MJzLJuVjn3fcJ90ZJ4+EfG/t9nGJMdZNtpcZxjqx4Mch+Yx+JqX8V6tBDr2uCSGO+dbI6RHbXTe7ZnYpE0AUHnJJ9cn4VW9I9qmnljSJWWVbW0kUyBSZZXMdu7E8Dn3c9huHrXWnDE8vkmo5tLKyks7eI28lyZZ1UtPOzsc9Zjzlc4HJ7Dtj3p/wvdTW1vrMst7brYW3sMbwShDJGmoSm368JfttYLvGDkNnIK8x/iXQbvSZojexRi5nh9ofpyM8bR4EZcggMGDDnjBzmvvh+8iVbOzGi2t/cvd3S2Yb/PnuLi3NuiO7ZQIm5mPbsPTI0jsuhXW4S2jdIdJEeJYeoUjUgK8QMnve6f48cdpuqDoUup3K2DpewwTNptuHuCiXDRLFGquZAzhQDj3c+uec8b0l7pryNC3iDWtXuVwGt9DVMZ9GawjVV/3TCoqP/SaloLHRp2kQXcN5J0oz9d4Cm6RhjyBC/j8eaBakLPCx24yEbd6BtvHxxxVm8Z2jR2UV1/7PzWQlnCte3V77VduNjbYZlDvgHkj3z28vOrQfWjz5SBjxzgKpPfH8aqLv4OkMWraamcCSyvbIgbffeFy24gc8BByeT8hXS65f4a//HdJAySt3q2Rk4RCshyBjux+P2fId+oCopSlKDy6JIjxuMpIrIw9VYEEV+e5reW1uL2zkyJLaea3fGRzC7RnvX6GrkPjvTDYa8LxUxbasnV3AYCzoBHKuc/6W/3H0oimSISs6kZJQuo7e9Gd2M+uM10jQfEOpalpDDU9TstO06yMVlLd2zMNVvAyr044IlztLDA3KpY4IUAjctD2NluD1oz1EUe8XK91+8cj5VJeFZ9M0vxDplxfbfZFE3s0xAKQmdQkcjZ7BMkE+QYHyJFHTLS31O5t47PTbQaDoqggNLEh1O5VuXKwvuVN3JLPuY5yQDzVD8VeCNWsHnvrEy6jYDLBOXu7RBwFKfaQdgVGfUcZPY6wz21vdJ054w6ZDAEkYI7EEHOaiuJX9nfQ22iwC0uEf2ZOq06RQIrKka4MrHGO/mPlxUcVEbnr3dkkZZQmx3uJEJ8mFqrIR6HcK7LqfhDwxqwi9rsmDRGQxNBPNEUMhBY7Ubac/FTXOh4NgXQfE90Lu5bU9EuL+C6tnEXsxitcyZjAUSe/GVdTu7+VVFckuLZDLh2McZILSII2OO/ubj93NY99sSGSVB8d20n7mwa6No3g22FyZ/Y4fYp7dGWaUJK7xmNTH0pJGd8tk5ICnHHfkWey8K6FabSLS23jt04I0GB25O6T8XNBxVXBO1irY7gY3D5jvWxHPHFxGkanzyu3PzwM/nXb7nQ9AvEKXWm2coPm8Kb/AEzvA3Z++ue+NdG8J+H7NJ7YXSX9zIEtLRZzJEygje7rKGfaOww3cgds4Csx3crfW6R/0EDj7+a2Y5YTjdG4+KH+lQK3lsTiSJlbHOMOo8u4wfyrYja3fasbruLKmA7KxZiAqhSc5PAFBPNb6TOuHZwQQR9UOp8mVj5/jWCXQrOYkxzwNnkCWIA/e8Rx/wBNDovidP8A8q1YfO3kb+teTpviNe+nann42Ux/gtBqv4du1XESKwzkCGdW7D9ibFaB0W/zIihkWBxA6tDGMsoDMgaM5yMjJ55+VTIg8QxEf4HUQRz/APCXYxjz4FZEu9egjiiGnyKkalV3afcDuSxJO3kkkkmgrN3p1ysap0JmIm6hMspIWPbgqAR3J7n4fCvdk8Id7foKUOZY5LkhpoDGDuiQxkIVfOSChPuj1qWur+W4zHcrEpxu2uvTYg+eyQA4+6tErZq4lmkhUEn60qIWIxkg5HFBlCmWeyi3GBpLqGEzKkbhIpEYlnErpHjgd3Xv34rYXw34ouVWRoLENtU7XvdOVgD67pyePur1a5vspYxW05JI6aSwKzE+iyOuazNoOvdcW66IkcrLucs9t041PALtE7Yz8SPWg9w+FdZtb3TYtQihUzCa8e3KrJbyW8DxAR+0QStzIW2/V4/eFdDj03wrpz2WpXUGn6fJZSNPFgxgszRMm1EChjgMMHBPyqD0LwzcaFbve21i+r6vKpiibfHBawAryqSzEHZ5MQuT247jAvg7xlqN1Pd37adazXMplnmd2uJSTxhUjG3gYAG7jFBqeKPEj61PBDbpILOGT/BxFMz3Fw3uB9g5zzhR8Tnv7tt8IeGP1VEdQ1BAdWuY9u3IYWULc9JCPtH7Z+7sOdzQvCek6IwuBvutQ2lTd3IG5FPdYUHuqPlz8asVRQcUpSg5/P4V1nXvEGqXmshbfS1cwWywzBprm2Q8Kmz6qsANxPPftnileJrOKw8TarbxxpHEZojCiAKkcUkSFVQCu61yf9Jtk1vqOm6ii4W6tzGzf+datkZ+YIx8qoqcIJWM+SyyRsPIdSNiOPmBXWfAVyJdBSDI32d1cQsM5OHbrKf+quTxkMZRHz1VSaDn7fEqf0q4eB9VjstSa2dttrqqIqFsALcLlos/6gSp+OB5UR1CWOKVCkqK6ZVtrDIypDA/MEAiqpJP7Tqd3JpcMaW1q62FzesB0ri7375I1ABYrHgBmH2mI8qldUurq4nTRdOlaO8njEt7cpjOn2TEqZAe3VfBWIfNuye9oW8A1JINN0vNr4asMwSzQn3tSaPKmCBjz0s56j92OQD3Y5msTysSod/Y+IbvVPE1oklo51yeIuJtiz3MKQS3CdFMZCosZUn9oAdzmqFsngfI3gFGIZM+8i4chsemBkfCu+3mjKzWMifQXOnzCSwuraIGS33KVbI80I91l7EeYIBFQufD/iKw9puYLWyeKaC5t9TuLWW2tQ2ltKbjfGl8cRyINyZ3MCoGQSuToUO/vL+8eKRr24vpnhEcnUSfKYXAUO/vnHPr9+7FTNvol3ZXMdpa6mgluYhbWdxbW1wI7iOdf8U6XMgCKkan6RtxPIGMnak7ZeG7yx1IXEFncNavAgs5dSv0tbqzuWUkTKdJaQlcZHcA58vtWrT9Lu1YtLdS6jqJKRS314+7ppGwcqka5jWMnnAzkjJJxwRr6FoOl3cl0Lq2E9vBHBAY523wNJG5ZdiLhCoABGQTz6Vc4YLe3jWKCGKGJBhY4UWNFHoFUAV4tbaO0hSGMcAszNgAu7HLMcetZj/ee1RVK/SPcpHo1nZ8dS8vosDz2Qgux9fSua2oLSw7ftykjBwcbsDn5VM+MdY/XGsuIGza6eDZ2rDs0zN78g/DPyU1GWUakuygjCrBF8z7i/1+6rCLh4QjeXV7Fz9WG01C+I573EnTDYPHngffzxgdKqn+CbQLFqd/sws0sdnBn6zRWy4LE89ySO/lVwqSpSn99qf32oFQfifRE13Sri0G0XUZ9osnOPdnQHCknyYZU/PPlU5/falB+e16ylw6yR3NsxjnRhh0KNs5yByDwflWXbHKm1sBGdmDYGIJW7jaeNjZPfjkjs1X/wAa+FZZ2fXNKjZrqNM31vGoZrhAMdVFwcsBww8x25Hvc7jk90vGvoHQjOAecEHuvpVRePCni82Cx6VrTt7NEAttduzO1smcBJ2b3jF5K/2ezeTHpSvHIqOjK6OoZHQhlZSMgqRxivz8x3BfddwmCpDYmhOO6N3I8sfxFSOkeI9d0XAsLgS2u4lrZ13xZJycwEgqfijD/TQdy4quTQx2niRlkUGz8T6e9rOpztN9YocZzx78bMP/ANKoOx/SZpbgJqNlPBIMBmtysqZ9dkuyQfgaa74y8P3dpZtp7zTX1rqNjeW6tDLGIulIOozMwxhkLrwftffUVYvCckh0LTreU5n003GkT88iTT5ntOfmFB++p0nFcytPG+m6XqGutHazy6Zf3p1CL3oo7qKeSGNJQY5GC7WZSR73mfXjS1X9ImvXqvFpVrHYRMCOvIwlmI55V3URj7lY+hoL34j8UaR4dty9w4ku2Um3s43Alf8Aec87U9SR8sniuKanqOo6vfTanqL7rmbiCJQVSGP7Kop7ADsOe+TyecTtJLK9xPLJdXcjF3mmLNhz3Yb8sT8Tz8B3r2Ixksx5PJJ75+H/AK1Ua4iIBYgep9G/7D++1XH9H/h86jqh1WdCbLSZDsJ+rPqH2QD2IjB3H4lfTiI0XRb/AMQ3ws7TMcUXSa8uSuUtImIOeeDIeQq/yFdu03T7HS7K1sLKPp29smxB3ZiTlnc+bMclj5k0G5T++9OKcVFP77mn9+dOKcUEXfaDo2osjXltHLtJIWRUkUH1CyqwHxxisaeGvD8f+XY20fAxst7UYx8o6mOKcUFZuPBXh2eXrGECTq9XLRwOpb4gp2+FSdpo1jaxxx4EiIcqmxI4Q3r04wAT881J8U4oFKcU4oFKcUoFKf32p/fagVX/ABdoh13Rbm1jA9rgIu7LnGZ4gfcz+8CV+/4VYP77UoPzlbOxjKHIltyWAIIbplveBB5yp7/6vhUgpUnO1WjkJZA6hl6h994WHnnllHnk/DNm8feHJNOum8QafGBbTODfIoysFy529UqPsSdm+P8Aq4qMbxsu4cwuQsgyd0T8NjI5GO6n4A+XFRefDUgv+locaLb2Vy93farcRzObu/CbAtnI7cgYIBIblFwMbjXSY44oo44okVI40VI0QBURFGAqqOAB5VweOa4ikilildJkYNBPEdhLqSVI2nAcenxOMhipv+i+PIWCW2tp05QMe1wIWjfHGZokywPqVBHqE7AL2QCMHmsD20bB13OFf3XXIZGUjBUq4Iwa9W91aXcSzWs8M8TdpIHWRD8MoTWaoquski6jcaZfyyLFewyHRbmDCMu1PpIG7jqp9dDjkeXuVv6NcSSWht7kKt9YSNZXwVdoaWMAiUD0kUq4/wBXwrY1Cxi1C2e3dmjfcktvNH/mW9xGd0c0fxU/086qT+I4bSWLUCInvklk0fXbKJ1V5GtWbZeQA8bVOeT5OBnK0F4zVH8aeKFs4pNI06QNfzgxzvGc+zRngjj7R/v4Ret+Pp7pGtdGikg3LiW4mK9VQfJdhIHzzn5VSR3Z3ZmaQkySN9Zx5hSecf3j1qPkcSqEAGQpIB78nhmz/f51MWltPNLaW9uje0ysLeBR5TvwzE8jCDJPzPpWlEpXa5OwqMrkHEScgsQPy9a6P4P0E2yDVbuNlnmjKWcMi4aC2bksw8nfjPoPiTQWfT7KDTrKzsof8u2iWNT5sRyzH4k5J+dbVKf32qKUpSgV8zXwmsTNQZciqT4m8Fw6g8uoaQyW+oNlpYWcpb3LeZ44Vz8sHz9atbyPzitWW5nUe6tBxW5hurOdrW+he1ukHvRSggkftD+oyPjWJ4wxDN3/AGwfL4OtdO1mY3sBgu7GK5jGdvVXLJ8Y3HvA/I1zy80+a3djaRTov7LkyHHpuP5ZFVGiVkxxKrLzxMofHl3rz0sH/JtGPqF+70rw9xdR8SW0hAz9gE+nlisJ1BBx7JMD6FHPn50G2qsvYQR+fuIufuNCC31mZ/iTxWst8zH3beTjHBQjPPbk1u28E9yUEhKL9ogFmPGMALgfn6UGI9GMEscBcZ7cZIXk/fVg0Pwlqmtnq3G+x07Kjruv0sw4LC2jbkjyDHj51J6PYaPaNFN7C11cK3UWa8AkCP23RxY6YI8uD271bU1C5kxlWzj49vSgl9OstN0m1jtLGFYoV5OOXkc4y8jnksfMn8q3Osvr51BrcznuK9deT5VFTXWX1p1l9ahuu/rTrv6mgmusvqKdVfUVCid/jTrt60E11V9RTqr61De0N609pf1oJnqr606q1De0v6199pagmeqvqKdVahvam9a++1N60Ex1V9adVfWof2pqe0tQTHVHrX3qD1qG9qNffaWoJjqD1p1B61Ee1H1p7UaCUlEE8csMyJJFKjRypIAyOjDBVgfI1yPxL4Su9Clm1DTVe40lzmRMFntVJ+pKByU9G8vP1bpPtRp7WO2eCCCD2IPBBzQcVglQghQrxt9eF+ePh6ithTHJgIwcZAEczYZT+7If5irlrXhHRb1pbnTpF067ZjIUVS1nI/ckovvKT+7x8KpV7Y6rpzML62LIna4gIkiYeqyx/wAwKqM6STWriVHubeX/AOorOrffJEckf7qkovEviJF+j1mdh/5sgcjHxcMagorscdOdgO4D4b8CK2DPv5LQsTyCQcn8RQSc3iLxLMMNrM67l7I8gI//AGthqJkMswUSyzzKMjaT0o85zyF94/HLVlDjg7kGP2QfnXzqxce8WZuBgZOSM4wuTz5UGIQtgDCKo+qiDjPyHH8azwwMSrAFjuCDjcSxGAApwCx8hU1p3hzWb8qWjFpATnrXWPeXuCsIPUP37avWkaBpGl7JVjW4vFGPap0TePQRqBhR6efxoIrw74TKvHf6rFIpRxLb2cjIxLjBEtzt8/RdxA8/QXmsAlr0HFRWWleA2a9jkUClKUHwivDIKyUoMBjB8q8GAHyrapQRz2UTd1rXfSbR85jH4VMYHwr5tFBX30CwfOYVP3CsR8N6Zn/4dP8Aiv8ASrLtFfNgoK4vh7T17QJ/xWsy6Pap2jUf7RU7sHwpsHwoIcWES9lA7eVexaAdhUrsFfNg9KCM9m+FfPZhUp0xTpj0oIr2b4U9m+FSvTHpTpigifZvgaezfOpbpj0FfOnQRPsx+NPZqlukK+dIUEV7NT2Y+lSvTHpTpD0oIk2xp7MfjUt0h6V96Q9KCI9mNPZjUt0h6V96Q9KCI9mPpXz2Y1MdMV86S+lBEezN6GnszehqX6Q9KdIelBEezN6V8NsT5VMdIU6S+lBBvYhwcitKbQopgc7hnOcEj8atPSX0FOkvpQc9ufAunXBJKkNknK5U8/EVon9HVuCdlzdKM5wsjYBHPANdQ6S+lOkvpQcxj/R1bggvdXbYxjc5PHpU1p/g+ysTuiaQE9yu1SfmQM/nV06Qr70h8KCKgsRCAAXPzPNbaxsMd62wg9K+7BQa4Q/GvSqaz7RX3bQYgDWVe1Nor7QKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQKUpQf/9k=',
        description: '125cc, 40 km/l, 2 Seater',
        status: 'available'
    },
    {
        id: 'BIKE005',
        name: 'Yamaha R15 V3',
        type: 'bike',
        price: 900,
        image: 'https://th.bing.com/th/id/OIP.E3N0qy5d0_DD_GGLcZAUuQHaEX?w=262&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        description: '155cc, 38 km/l, 2 Seater',
        status: 'available'
    },

    // Cars
    {
        id: 'CAR001',
        name: 'Maruti Swift',
        type: 'car',
        price: 1500,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
        description: '1200cc, 22 km/l, 5 Seater',
        status: 'available'
    },
    {
        id: 'CAR002',
        name: 'Hyundai i20',
        type: 'car',
        price: 1800,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
        description: '1200cc, 20 km/l, 5 Seater',
        status: 'available'
    },
    {
        id: 'CAR003',
        name: 'Honda City',
        type: 'car',
        price: 2000,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
        description: '1500cc, 18 km/l, 5 Seater',
        status: 'available'
    },
    {
        id: 'CAR004',
        name: 'Toyota Innova',
        type: 'car',
        price: 3000,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
        description: '2400cc, 12 km/l, 7 Seater',
        status: 'available'
    },
    {
        id: 'CAR005',
        name: 'Mahindra Thar',
        type: 'car',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=500&h=300&fit=crop',
        description: '2000cc, 15 km/l, 4 Seater',
        status: 'available'
    },

    // Scooties
    {
        id: 'SCOOTY001',
        name: 'Honda Activa 6G',
        type: 'scooty',
        price: 400,
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&h=300&fit=crop',
        description: '110cc, 45 km/l, 2 Seater',
        status: 'available'
    },
    {
        id: 'SCOOTY002',
        name: 'TVS Jupiter',
        type: 'scooty',
        price: 350,
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop',
        description: '110cc, 48 km/l, 2 Seater',
        status: 'available'
    },
    {
        id: 'SCOOTY003',
        name: 'Suzuki Access 125',
        type: 'scooty',
        price: 450,
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&h=300&fit=crop',
        description: '125cc, 42 km/l, 2 Seater',
        status: 'available'
    },
    {
        id: 'SCOOTY004',
        name: 'Yamaha Fascino',
        type: 'scooty',
        price: 400,
        image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&h=300&fit=crop',
        description: '125cc, 44 km/l, 2 Seater',
        status: 'available'
    },
    {
        id: 'SCOOTY005',
        name: 'Hero Maestro Edge',
        type: 'scooty',
        price: 380,
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500&h=300&fit=crop',
        description: '110cc, 46 km/l, 2 Seater',
        status: 'available'
    }
];

// Function to add vehicles to Excel file
async function addVehicles() {
    try {
        // Read existing workbook or create new one
        let workbook;
        try {
            workbook = XLSX.readFile('USER_DATA.xlsx');
        } catch (error) {
            workbook = XLSX.utils.book_new();
        }

        // Create or update Vehicles sheet
        const worksheet = XLSX.utils.json_to_sheet(vehicles);
        workbook.Sheets['Vehicles'] = worksheet;

        // Write to file
        XLSX.writeFile(workbook, 'USER_DATA.xlsx');
        console.log('Successfully added 15 vehicles to the database!');
    } catch (error) {
        console.error('Error adding vehicles:', error);
    }
}

// Run the function
addVehicles(); 