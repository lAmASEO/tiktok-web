<template>
  <a-descriptions title="详情">
    <a-descriptions-item label="Payout">
      ${{ detail.payout_converted }}
    </a-descriptions-item>
    <a-descriptions-item label="Price format">
      {{ detail.price_format }}
    </a-descriptions-item>
    <a-descriptions-item label="Vertical">
      {{ detail.vertical_name }}
    </a-descriptions-item>
    <a-descriptions-item label="Flow">
      <span v-for="(item, index) in detail.flows" :key="index">
        <span v-if="index != 0">,</span>
        {{ item.flow_name }}
      </span>
    </a-descriptions-item>
    <a-descriptions-item label="Platforms">
      <span v-for="(item, index) in detail.platforms" :key="index">
        <span v-if="index != 0">,</span>
        {{ item.platform_name }}
      </span>
    </a-descriptions-item>
    <a-descriptions-item label="Tracking type">
      {{ detail.tracking_type }}
    </a-descriptions-item>
    <a-descriptions-item label="Allowed countries">
      <span v-for="(item, index) in detail.allowed_countries" :key="index">
        <span v-if="index != 0">,</span>
        {{ item.country_name }}
      </span>
    </a-descriptions-item>
    <a-descriptions-item label="Description">
      <div v-html="detail.description" />
    </a-descriptions-item>
    <a-descriptions-item label="Restrictions">
      <div v-html="detail.restrictions" />
    </a-descriptions-item>
    <a-descriptions-item label="Offer capped">
      {{ detail.offer_capped }}
    </a-descriptions-item>
    <a-descriptions-item label="Media types allowed">
      <span v-for="(item, index) in detail.allowed_media_types" :key="index">
        <span v-if="index != 0">,</span>
        {{ item.allowed_media_type_name }}
      </span>
    </a-descriptions-item>
    <a-descriptions-item label="Target demo">
      {{ detail.demo }};
      {{ detail.age }}
    </a-descriptions-item>
    <a-descriptions-item label="3G/Wi-Fi">
      <!-- {{ detail.price_format }} -->
    </a-descriptions-item>
    <a-descriptions-item label="Adult traffic">
      {{ detail.adult }}
    </a-descriptions-item>
    <a-descriptions-item label="Incentivized promotion">
      {{ detail.incentivized }}
    </a-descriptions-item>
    <a-descriptions-item label="Creative preapproval">
      <!-- {{ detail.price_format }} -->
    </a-descriptions-item>
    <a-descriptions-item label="Carrier">
      <!-- {{ detail.price_format }} -->
    </a-descriptions-item>
    <a-descriptions-item label="Loyalty">
      {{ detail.loyalty }}
    </a-descriptions-item>
  </a-descriptions>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: function() {
        return {}
      }
    }
  }
}
</script>

<style>
</style>
