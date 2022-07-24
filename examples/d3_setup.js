/* Code to generate candlesticks in D3 from: https://codepen.io/jazon3008/pen/zgGjqN?editors=0010 */

import { c2mChart } from "../dist/index.mjs";

const json = [
    {
        close: 69.06,
        date: "20161020",
        high: 70.1,
        low: 68.51,
        open: 68.87,
        openInt: 0,
        volume: 736533
    },
    {
        close: 70.58,
        date: "20161023",
        high: 70.74,
        low: 69.67,
        open: 69.9,
        openInt: 0,
        volume: 396860
    },
    {
        close: 71.17,
        date: "20161024",
        high: 72.99,
        low: 71.17,
        open: 72.6,
        openInt: 0,
        volume: 663227
    },
    {
        close: 72,
        date: "20161025",
        high: 72.12,
        low: 69.85,
        open: 71.4,
        openInt: 0,
        volume: 598760
    },
    {
        close: 70.77,
        date: "20161026",
        high: 72.36,
        low: 70.72,
        open: 71.66,
        openInt: 0,
        volume: 700031
    },
    {
        close: 71.8,
        date: "20161027",
        high: 71.8,
        low: 70.12,
        open: 70.99,
        openInt: 0,
        volume: 484284
    },
    {
        close: 71.08,
        date: "20161030",
        high: 72.25,
        low: 70.75,
        open: 71.41,
        openInt: 0,
        volume: 570717
    },
    {
        close: 69,
        date: "20161101",
        high: 70.77,
        low: 68.65,
        open: 70.73,
        openInt: 0,
        volume: 852413
    },
    {
        close: 69.48,
        date: "20161102",
        high: 69.98,
        low: 68.34,
        open: 69,
        openInt: 0,
        volume: 715781
    },
    {
        close: 70.74,
        date: "20161103",
        high: 70.8,
        low: 69.5,
        open: 69.61,
        openInt: 0,
        volume: 656200
    },
    {
        close: 72.45,
        date: "20161106",
        high: 73.47,
        low: 72.02,
        open: 72.24,
        openInt: 0,
        volume: 1142748
    },
    {
        close: 74.95,
        date: "20161107",
        high: 74.95,
        low: 72.65,
        open: 72.65,
        openInt: 0,
        volume: 1245854
    },
    {
        close: 81,
        date: "20161108",
        high: 81,
        low: 74.01,
        open: 74.1,
        openInt: 0,
        volume: 4076393
    },
    {
        close: 87.52,
        date: "20161109",
        high: 91,
        low: 85.51,
        open: 87.1,
        openInt: 0,
        volume: 4196150
    },
    {
        close: 84.16,
        date: "20161113",
        high: 90.75,
        low: 84.16,
        open: 90.01,
        openInt: 0,
        volume: 2099332
    },
    {
        close: 82.5,
        date: "20161114",
        high: 84,
        low: 81.11,
        open: 82,
        openInt: 0,
        volume: 1396786
    },
    {
        close: 82,
        date: "20161115",
        high: 83.3,
        low: 81.31,
        open: 82.99,
        openInt: 0,
        volume: 989645
    },
    {
        close: 81.92,
        date: "20161116",
        high: 83.78,
        low: 81.6,
        open: 82.04,
        openInt: 0,
        volume: 1018896
    },
    {
        close: 81,
        date: "20161117",
        high: 81.5,
        low: 80.31,
        open: 81.5,
        openInt: 0,
        volume: 520056
    },
    {
        close: 82.93,
        date: "20161120",
        high: 84,
        low: 82.69,
        open: 83.7,
        openInt: 0,
        volume: 717689
    },
    {
        close: 85,
        date: "20161121",
        high: 86.42,
        low: 84.52,
        open: 85,
        openInt: 0,
        volume: 1078227
    },
    {
        close: 86.61,
        date: "20161122",
        high: 86.7,
        low: 84.26,
        open: 86.2,
        openInt: 0,
        volume: 1159127
    },
    {
        close: 89.8,
        date: "20161123",
        high: 89.8,
        low: 87.85,
        open: 88.2,
        openInt: 0,
        volume: 1310932
    },
    {
        close: 88.55,
        date: "20161124",
        high: 89.89,
        low: 87.92,
        open: 89.89,
        openInt: 0,
        volume: 934279
    },
    {
        close: 88.5,
        date: "20161127",
        high: 90.88,
        low: 88.5,
        open: 90.1,
        openInt: 0,
        volume: 789974
    },
    {
        close: 86.89,
        date: "20161128",
        high: 89.59,
        low: 86.5,
        open: 87.5,
        openInt: 0,
        volume: 1229412
    },
    {
        close: 87.36,
        date: "20161129",
        high: 89.9,
        low: 85.6,
        open: 86.61,
        openInt: 0,
        volume: 1479872
    },
    {
        close: 86.85,
        date: "20161130",
        high: 88.68,
        low: 85,
        open: 88.68,
        openInt: 0,
        volume: 1198252
    },
    {
        close: 86.8,
        date: "20161201",
        high: 87.35,
        low: 86.17,
        open: 86.65,
        openInt: 0,
        volume: 646042
    },
    {
        close: 91.84,
        date: "20161204",
        high: 92.47,
        low: 88.88,
        open: 89.18,
        openInt: 0,
        volume: 1956876
    },
    {
        close: 95.3,
        date: "20161205",
        high: 95.59,
        low: 91.65,
        open: 92.19,
        openInt: 0,
        volume: 1697070
    },
    {
        close: 94.25,
        date: "20161206",
        high: 98.4,
        low: 94.02,
        open: 96.5,
        openInt: 0,
        volume: 2191592
    },
    {
        close: 97.95,
        date: "20161207",
        high: 97.95,
        low: 93.6,
        open: 94.25,
        openInt: 0,
        volume: 1646321
    },
    {
        close: 96.75,
        date: "20161208",
        high: 98.77,
        low: 96.6,
        open: 98,
        openInt: 0,
        volume: 1198578
    },
    {
        close: 96.41,
        date: "20161211",
        high: 97.44,
        low: 95.21,
        open: 97.44,
        openInt: 0,
        volume: 632664
    },
    {
        close: 95.8,
        date: "20161212",
        high: 97.4,
        low: 95,
        open: 96,
        openInt: 0,
        volume: 870550
    },
    {
        close: 93.59,
        date: "20161213",
        high: 95.3,
        low: 92.73,
        open: 95,
        openInt: 0,
        volume: 1359235
    },
    {
        close: 91.77,
        date: "20161214",
        high: 94.7,
        low: 91.42,
        open: 93.75,
        openInt: 0,
        volume: 1085806
    },
    {
        close: 90,
        date: "20161215",
        high: 92.47,
        low: 89.5,
        open: 91.55,
        openInt: 0,
        volume: 1904685
    },
    {
        close: 89.77,
        date: "20161218",
        high: 89.77,
        low: 87.55,
        open: 88.9,
        openInt: 0,
        volume: 1097067
    },
    {
        close: 92.29,
        date: "20161219",
        high: 92.55,
        low: 89.24,
        open: 90.01,
        openInt: 0,
        volume: 657980
    },
    {
        close: 92.13,
        date: "20161220",
        high: 93.93,
        low: 91.7,
        open: 93,
        openInt: 0,
        volume: 519732
    },
    {
        close: 92.65,
        date: "20161221",
        high: 92.68,
        low: 89.7,
        open: 90.4,
        openInt: 0,
        volume: 724843
    },
    {
        close: 91.2,
        date: "20161222",
        high: 92.8,
        low: 90.77,
        open: 92.49,
        openInt: 0,
        volume: 369498
    },
    {
        close: 92,
        date: "20161226",
        high: 92.19,
        low: 90.75,
        open: 90.8,
        openInt: 0,
        volume: 440444
    },
    {
        close: 92,
        date: "20161227",
        high: 93.3,
        low: 91.99,
        open: 92.53,
        openInt: 0,
        volume: 757325
    },
    {
        close: 91.7,
        date: "20161228",
        high: 93.27,
        low: 91.7,
        open: 92,
        openInt: 0,
        volume: 366772
    },
    {
        close: 92.48,
        date: "20161229",
        high: 93,
        low: 91.78,
        open: 92.1,
        openInt: 0,
        volume: 377095
    },
    {
        close: 92.17,
        date: "20170101",
        high: 92.65,
        low: 91.61,
        open: 92.48,
        openInt: 0,
        volume: 170888
    },
    {
        close: 94,
        date: "20170102",
        high: 95.87,
        low: 93.07,
        open: 93.5,
        openInt: 0,
        volume: 1067180
    },
    {
        close: 96,
        date: "20170103",
        high: 96.1,
        low: 93.9,
        open: 94.55,
        openInt: 0,
        volume: 1125391
    },
    {
        close: 95.81,
        date: "20170104",
        high: 96.76,
        low: 95.2,
        open: 96,
        openInt: 0,
        volume: 850612
    },
    {
        close: 96,
        date: "20170108",
        high: 96.3,
        low: 95.2,
        open: 95.47,
        openInt: 0,
        volume: 486443
    },
    {
        close: 100.2,
        date: "20170109",
        high: 100.85,
        low: 96.9,
        open: 96.9,
        openInt: 0,
        volume: 1599321
    },
    {
        close: 105.85,
        date: "20170110",
        high: 106,
        low: 100.85,
        open: 101,
        openInt: 0,
        volume: 2534580
    },
    {
        close: 108.1,
        date: "20170111",
        high: 109.3,
        low: 106.15,
        open: 106.3,
        openInt: 0,
        volume: 3155375
    },
    {
        close: 109,
        date: "20170112",
        high: 109.8,
        low: 106.75,
        open: 108.2,
        openInt: 0,
        volume: 1284321
    },
    {
        close: 110,
        date: "20170115",
        high: 111.75,
        low: 109,
        open: 109,
        openInt: 0,
        volume: 1188683
    },
    {
        close: 109.75,
        date: "20170116",
        high: 110.5,
        low: 107.1,
        open: 108.25,
        openInt: 0,
        volume: 1110982
    },
    {
        close: 113.35,
        date: "20170117",
        high: 114.75,
        low: 109,
        open: 109.5,
        openInt: 0,
        volume: 1966280
    },
    {
        close: 112.7,
        date: "20170118",
        high: 114.5,
        low: 111.3,
        open: 113.85,
        openInt: 0,
        volume: 1189973
    },
    {
        close: 112.95,
        date: "20170119",
        high: 113,
        low: 111.7,
        open: 112,
        openInt: 0,
        volume: 858191
    },
    {
        close: 113,
        date: "20170122",
        high: 114.45,
        low: 112.9,
        open: 113.5,
        openInt: 0,
        volume: 533825
    },
    {
        close: 117.6,
        date: "20170123",
        high: 118,
        low: 113.1,
        open: 113.2,
        openInt: 0,
        volume: 1736364
    },
    {
        close: 122.65,
        date: "20170124",
        high: 122.65,
        low: 119,
        open: 119,
        openInt: 0,
        volume: 2120289
    },
    {
        close: 122.05,
        date: "20170125",
        high: 125.4,
        low: 121.4,
        open: 123.5,
        openInt: 0,
        volume: 1507500
    },
    {
        close: 125,
        date: "20170126",
        high: 125.6,
        low: 113.1,
        open: 121,
        openInt: 0,
        volume: 1789594
    },
    {
        close: 122.3,
        date: "20170129",
        high: 126.5,
        low: 122.3,
        open: 125,
        openInt: 0,
        volume: 1109385
    },
    {
        close: 123.9,
        date: "20170130",
        high: 125.45,
        low: 121.1,
        open: 122.3,
        openInt: 0,
        volume: 1267779
    },
    {
        close: 126.75,
        date: "20170131",
        high: 128.75,
        low: 125.45,
        open: 125.45,
        openInt: 0,
        volume: 1125347
    },
    {
        close: 125.5,
        date: "20170201",
        high: 127,
        low: 124.15,
        open: 127,
        openInt: 0,
        volume: 723421
    },
    {
        close: 124.1,
        date: "20170202",
        high: 124.85,
        low: 122.8,
        open: 123.9,
        openInt: 0,
        volume: 928813
    },
    {
        close: 125.95,
        date: "20170205",
        high: 126.3,
        low: 123.65,
        open: 124.2,
        openInt: 0,
        volume: 572845
    },
    {
        close: 124.7,
        date: "20170206",
        high: 125.65,
        low: 123.8,
        open: 124.8,
        openInt: 0,
        volume: 1034967
    },
    {
        close: 124,
        date: "20170207",
        high: 126.8,
        low: 124,
        open: 126.5,
        openInt: 0,
        volume: 1159006
    },
    {
        close: 123.85,
        date: "20170208",
        high: 125.35,
        low: 123.2,
        open: 124.75,
        openInt: 0,
        volume: 1073193
    },
    {
        close: 126.85,
        date: "20170209",
        high: 127.4,
        low: 123.6,
        open: 125.1,
        openInt: 0,
        volume: 1551728
    },
    {
        close: 130.95,
        date: "20170212",
        high: 131.2,
        low: 129.05,
        open: 131,
        openInt: 0,
        volume: 1080271
    },
    {
        close: 129,
        date: "20170213",
        high: 131.5,
        low: 129,
        open: 131,
        openInt: 0,
        volume: 1145528
    },
    {
        close: 128.95,
        date: "20170214",
        high: 128.95,
        low: 125.6,
        open: 126.7,
        openInt: 0,
        volume: 1042087
    },
    {
        close: 128.9,
        date: "20170215",
        high: 129.75,
        low: 127.15,
        open: 128.75,
        openInt: 0,
        volume: 779791
    },
    {
        close: 127.8,
        date: "20170216",
        high: 128.8,
        low: 127.25,
        open: 128.5,
        openInt: 0,
        volume: 859624
    },
    {
        close: 130.4,
        date: "20170219",
        high: 130.4,
        low: 128.6,
        open: 128.65,
        openInt: 0,
        volume: 635985
    },
    {
        close: 135.5,
        date: "20170220",
        high: 135.55,
        low: 129.75,
        open: 129.85,
        openInt: 0,
        volume: 1288079
    },
    {
        close: 133.55,
        date: "20170221",
        high: 136,
        low: 132.45,
        open: 135,
        openInt: 0,
        volume: 1022037
    },
    {
        close: 133,
        date: "20170222",
        high: 135.75,
        low: 132,
        open: 132.8,
        openInt: 0,
        volume: 1073221
    },
    {
        close: 130.5,
        date: "20170223",
        high: 133.15,
        low: 127.55,
        open: 133.1,
        openInt: 0,
        volume: 2105208
    },
    {
        close: 130.75,
        date: "20170226",
        high: 132.5,
        low: 128.85,
        open: 130.5,
        openInt: 0,
        volume: 670739
    },
    {
        close: 129,
        date: "20170227",
        high: 130.5,
        low: 128.1,
        open: 130.15,
        openInt: 0,
        volume: 894330
    },
    {
        close: 131.5,
        date: "20170228",
        high: 132.4,
        low: 130.1,
        open: 131.55,
        openInt: 0,
        volume: 832401
    },
    {
        close: 130.2,
        date: "20170301",
        high: 132.3,
        low: 129.1,
        open: 131.95,
        openInt: 0,
        volume: 735251
    },
    {
        close: 127.6,
        date: "20170302",
        high: 128.85,
        low: 126.6,
        open: 128.6,
        openInt: 0,
        volume: 826042
    },
    {
        close: 124.3,
        date: "20170305",
        high: 127.4,
        low: 124.3,
        open: 127,
        openInt: 0,
        volume: 706871
    },
    {
        close: 118.95,
        date: "20170306",
        high: 125.4,
        low: 118.95,
        open: 124,
        openInt: 0,
        volume: 1832586
    },
    {
        close: 120.5,
        date: "20170307",
        high: 122.6,
        low: 119,
        open: 119,
        openInt: 0,
        volume: 777642
    },
    {
        close: 117.4,
        date: "20170308",
        high: 119.25,
        low: 115.55,
        open: 118.5,
        openInt: 0,
        volume: 1312652
    },
    {
        close: 118,
        date: "20170309",
        high: 120.55,
        low: 118,
        open: 118.2,
        openInt: 0,
        volume: 793416
    },
    {
        close: 122.55,
        date: "20170312",
        high: 122.7,
        low: 120.5,
        open: 120.8,
        openInt: 0,
        volume: 972809
    },
    {
        close: 124.25,
        date: "20170313",
        high: 124.7,
        low: 120.6,
        open: 123.55,
        openInt: 0,
        volume: 1031232
    },
    {
        close: 123.45,
        date: "20170314",
        high: 126.55,
        low: 123.3,
        open: 124.4,
        openInt: 0,
        volume: 827418
    },
    {
        close: 127.9,
        date: "20170315",
        high: 128.1,
        low: 126.1,
        open: 127,
        openInt: 0,
        volume: 837740
    },
    {
        close: 127,
        date: "20170316",
        high: 129.45,
        low: 125.8,
        open: 127,
        openInt: 0,
        volume: 1730378
    },
    {
        close: 125.6,
        date: "20170319",
        high: 126.95,
        low: 123.8,
        open: 126,
        openInt: 0,
        volume: 760706
    },
    {
        close: 123,
        date: "20170320",
        high: 126.4,
        low: 122.4,
        open: 124.1,
        openInt: 0,
        volume: 1045429
    },
    {
        close: 122.75,
        date: "20170321",
        high: 123.1,
        low: 119.2,
        open: 121,
        openInt: 0,
        volume: 822460
    },
    {
        close: 121.4,
        date: "20170322",
        high: 124.5,
        low: 120.4,
        open: 123.95,
        openInt: 0,
        volume: 916908
    },
    {
        close: 120,
        date: "20170323",
        high: 123.1,
        low: 119.8,
        open: 122,
        openInt: 0,
        volume: 478413
    },
    {
        close: 117.25,
        date: "20170326",
        high: 118.65,
        low: 116.35,
        open: 118,
        openInt: 0,
        volume: 855109
    },
    {
        close: 119,
        date: "20170327",
        high: 120.55,
        low: 118.05,
        open: 119.15,
        openInt: 0,
        volume: 449615
    },
    {
        close: 118.5,
        date: "20170328",
        high: 122.4,
        low: 116.8,
        open: 121.2,
        openInt: 0,
        volume: 1195606
    },
    {
        close: 119.35,
        date: "20170329",
        high: 119.4,
        low: 115.6,
        open: 119.2,
        openInt: 0,
        volume: 678260
    },
    {
        close: 115.8,
        date: "20170330",
        high: 118.85,
        low: 115.8,
        open: 118.85,
        openInt: 0,
        volume: 788879
    },
    {
        close: 117.95,
        date: "20170402",
        high: 119.3,
        low: 116.2,
        open: 117.6,
        openInt: 0,
        volume: 551415
    },
    {
        close: 120.1,
        date: "20170403",
        high: 120.65,
        low: 116.85,
        open: 117,
        openInt: 0,
        volume: 825906
    },
    {
        close: 128.5,
        date: "20170404",
        high: 128.5,
        low: 120.8,
        open: 121.8,
        openInt: 0,
        volume: 1332119
    },
    {
        close: 128.7,
        date: "20170405",
        high: 128.8,
        low: 125.8,
        open: 127.2,
        openInt: 0,
        volume: 1001274
    },
    {
        close: 129.5,
        date: "20170406",
        high: 129.5,
        low: 126.3,
        open: 126.6,
        openInt: 0,
        volume: 1003953
    },
    {
        close: 126.25,
        date: "20170409",
        high: 129,
        low: 126.25,
        open: 129,
        openInt: 0,
        volume: 534898
    },
    {
        close: 122.1,
        date: "20170410",
        high: 126.4,
        low: 121.75,
        open: 126.25,
        openInt: 0,
        volume: 981963
    },
    {
        close: 121.5,
        date: "20170411",
        high: 123.8,
        low: 120.1,
        open: 121,
        openInt: 0,
        volume: 630891
    },
    {
        close: 121.45,
        date: "20170412",
        high: 123.5,
        low: 119.1,
        open: 122.95,
        openInt: 0,
        volume: 491388
    },
    {
        close: 118,
        date: "20170417",
        high: 121.7,
        low: 118,
        open: 121.45,
        openInt: 0,
        volume: 658237
    },
    {
        close: 121,
        date: "20170418",
        high: 121.5,
        low: 118.2,
        open: 119.1,
        openInt: 0,
        volume: 708707
    },
    {
        close: 121.75,
        date: "20170419",
        high: 123.3,
        low: 119.7,
        open: 120.2,
        openInt: 0,
        volume: 738548
    },
    {
        close: 120.6,
        date: "20170420",
        high: 123.35,
        low: 120.6,
        open: 123,
        openInt: 0,
        volume: 471803
    }
];

var totalWidth = window.innerWidth;
var totalHeight = window.innerHeight;

var margin = { top: 10, left: 50, bottom: 100, right: 50 };

var width = totalWidth - margin.left - margin.right;
var height = totalHeight - margin.top - margin.bottom;

window.addEventListener("resize", function (e) {
    totalWidth = window.innerWidth;
    totalHeight = window.innerHeight;

    width = totalWidth - margin.left - margin.right;
    height = totalHeight - margin.top - margin.bottom;
    redrawChart();
});

// DATA STUFF
var formatDecimal = d3.format(",.2f");

var parseDate = d3.timeParse("%Y%m%d"); // 20150630

var outputFormat = d3.timeFormat("%d %b %Y"); // 30 June 2015

var dataLoaded = null;

var dataModelJSON = function (d) {
    return {
        date: parseDate(+d.date),
        open: +d.open,
        high: +d.high,
        low: +d.low,
        close: +d.close,
        volume: +d.volume,
        openInt: +d.openInt
    };
};

var data = json.map(dataModelJSON);

function setData(data) {
    dataLoaded = data;
}

function redrawChart() {
    if (dataLoaded) {
        d3.select("#candle-chart").remove();
        prepareForBuild(dataLoaded);
        buildChart(dataLoaded);
    }
}

var xScale, xLabels, xAxis, yIsLinear, yDomain, yRange, yScale, yAxis;

function prepareForBuild(data) {
    xScale = d3
        .scaleBand()
        .domain(
            data.map(function (d) {
                return d.date;
            })
        )
        .range([0, width])
        .paddingInner(0.2)
        .paddingOuter(0)
        .align(0.5);

    xLabels = xScale.domain().filter(function (d, i) {
        if (i === data.length - 1) return d;
        var next;

        if (data[i + 1]) {
            next = data[i + 1].date;
        } else {
            return false;
        }

        var monthA = d.getMonth();
        var monthB = next.getMonth();

        return monthB > monthA ? d : monthB === 0 && monthA === 11 ? d : false;
    });

    xAxis = d3.axisBottom(xScale).tickFormat(outputFormat).tickValues(xLabels);

    yIsLinear = true;
    yDomain = [d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)];
    yRange = [height, 0];
    yScale = d3.scaleLinear().domain(yDomain).range(yRange).nice(5);
    yAxis = d3
        .axisLeft(yScale)
        .ticks(5)
        .tickSizeInner(-width)
        .tickFormat(formatDecimal);
}

function buildChart(data) {
    var svg = d3
        .select("#examples")
        .append("svg")
        .attr("id", "candle-chart")
        .attr("width", totalWidth)
        .attr("height", totalHeight);

    var mainGroup = svg
        .append("g")
        .attr("id", "mainGroup")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    mainGroup
        .append("g")
        .attr("id", "xAxis")
        .attr("class", "axis")
        .attr("transform", `translate(0,${height})`)
        .call(customXAxis);

    function customXAxis(g) {
        g.call(xAxis);
        g.select(".domain").attrs({});
        g.selectAll(".tick line")
            .attr("y1", -height)
            .attr("y2", 0)
            .attr("stroke", "#777")
            .attr("stroke-dasharray", "3,2");
    }
    mainGroup
        .append("g")
        .attr("id", "yAxis")
        .attr("class", "axis")
        .call(customYAxis);

    function customYAxis(g) {
        g.call(yAxis);
        g.selectAll(".tick line")
            .attr("x1", 0)
            .attr("x2", width)
            .attr("stroke", "#777")
            .attr("stroke-dasharray", "3,2");
        g.selectAll(".tick:first-of-type line").remove();

        g.selectAll(".tick text").attr("x", -9);
    }
    var eventGroup = mainGroup.append("g").attr("id", "event-overlay");

    var canvasGroup = eventGroup.append("g").attr("id", "circleGroup");

    var candleSettings = {
        stroke: "black",
        up: "green",
        down: "#d30000",
        hover: "#ffffff",
        lineMode: false
    };

    canvasGroup
        .selectAll("line")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function (d, i) {
            return xScale(d.date) + xScale.bandwidth() * 0.5;
        })

        .attr("y1", function (d) {
            return yScale(d["high"]);
        })
        .attr("x2", function (d, i) {
            return xScale(d.date) + xScale.bandwidth() * 0.5;
        })

        .attr("y2", function (d) {
            return yScale(d["low"]);
        })

        .style("stroke", candleSettings.stroke)
        .style("stroke-width", "1px")
        .style("opacity", 1);

    if (xScale.bandwidth() > 1) {
        candleSettings.lineMode = false;
        canvasGroup
            .selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attrs({
                x: function (d, i) {
                    return xScale(d.date);
                },
                y: function (d, i) {
                    return yScale(Math.max(d.close, d.open));
                },
                width: xScale.bandwidth(),
                height: function (d, i) {
                    var max = yScale(Math.min(d.close, d.open));
                    var min = yScale(Math.max(d.close, d.open));
                    var diff = max - min;
                    return diff || 0.1;
                }
            })
            .styles({
                fill: function (d) {
                    return d.close > d.open
                        ? candleSettings.up
                        : candleSettings.down;
                },
                stroke: candleSettings.stroke
            });
    } else {
        candleSettings.lineMode = true;
    }

    var els = candleSettings.lineMode
        ? canvasGroup.selectAll("line")
        : canvasGroup.selectAll("rect");
    els.on("mouseover", function () {
        d3.select(this)
            .attrs({
                cursor: "pointer"
            })
            .styles({
                stroke: candleSettings.hover
            });
    }).on("mouseout", function () {
        d3.select(this)
            .attrs({})
            .styles({
                fill: function (d) {
                    return d.close > d.open
                        ? candleSettings.up
                        : candleSettings.down;
                },
                stroke: candleSettings.stroke,
                "stroke-width": "1px"
            });
    });

    const { err, data: c2m } = c2mChart({
        type: "candlestick",
        element: document.getElementById("examples"),
        axes: {
            x: {
                label: "Day",
                format: (index) => outputFormat(data[index].date)
            },
            y: {
                label: "Price",
                format: (value) => numeral(value).format("$0"),
                min: 60,
                max: 140
            }
        },
        data: data.map(({ open, high, low, close }, x) => {
            return { x, open, high, low, close };
        }),
        options: {
            onFocusCallback: ({ index }) => {
                canvasGroup
                    .selectAll("rect")
                    .styles({ stroke: candleSettings.stroke });
                d3.select(
                    canvasGroup.selectAll("rect")._groups[0][index]
                ).styles({ stroke: candleSettings.hover });
            }
        }
    });
    console.log(err, c2m);
}

(function (data) {
    setData(data);
    prepareForBuild(data);
    buildChart(data);
})(data);
