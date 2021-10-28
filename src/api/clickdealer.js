import {
  get
} from './clickdealerHttp'

export const getOfferFeed = res => get('/offers.asmx/OfferFeed', res)
export const GetCampaignsLinks = res => get('/offers.asmx/GetCampaignsLinks', res)
export const GetCampaign = res => get('/offers.asmx/GetCampaign', res)
