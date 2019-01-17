'use strict';

module.exports = {
  app: {
    title: 'MEAN.JS',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
  },
  port: process.env.PORT || 3000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  logo: 'modules/core/img/brand/logo.png',
  favicon: 'modules/core/img/brand/favicon.ico',
  nexmo: {
         'api_key': '6ca3abea',
         api_secret: 'baff0c048469dd53',
         to: '',
         from: '+237691252104',
         text: ''
  },
  google: {
        'geocoding': {
          apiKey :  'AIzaSyCCB9yiowdC3o3fw79YXEp-nV9xY8A_ezA'
        }
  },
  notification: {
    mail: {
      senderEmail: 'tanejuth@tchizercm.com',
      transporter: {
        host: 'email-smtp.us-east-1.amazonaws.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'AKIAJFGMXEW26WZCQCEQ',
          pass: 'AsqogJFK4LAIB2ct+VCNB6T1kL4jCio7SD0xiAF6gadF'  // generated ethereal password
        }
      }
    },
    SMS: {
      nexmo: {
        api_key: 'd7845924',
        api_secret: '83AIuRb1HrQ81DSq',
        to: '',
        from: '0660606060',
        text: ''
      }
    },
  },
  documents: {
        'user': ['first_name', 'last_name', 'username', 'email','phonenumber'],
        'business': ['bz_name','bz_description', 'bz_website', 'bz_category', 'bz_address1', 'bz_po_box', 'bz_city', 'bz_region_state', 'bz_country', 'bz_location'],
        'service': ['sv_name', 'sv_description'],
        'product': ['pd_name', 'pd_description', 'pd_color', 'pd_brand','pd_category']
  },
  client: {
    url: "https://tchizer.com"
  },
  email: {
    subjects: {
      resetPassword: "Tchizer CM - Password Reset",
      verifyAccount: "Tchizer CM - Email Verification",
      applyBusiness: "Business application received"
    }
  }
}
