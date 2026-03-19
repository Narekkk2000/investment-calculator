<script setup lang="ts">
import BaseBox from '@/components/base/layout/BaseBox.vue'
import BaseFlex from '@/components/base/layout/BaseFlex.vue'
import BaseHeading from '@/components/base/text/BaseHeading.vue'

import InitialInvestmentInput from '@/pages/investmentCalculator/inputs/InitialInvestmentInput.vue'
import ContributionInput from '@/pages/investmentCalculator/inputs/ContributionInput.vue'
import InvestmentTermInput from '@/pages/investmentCalculator/inputs/InvestmentTermInput.vue'
import ReturnRateInput from '@/pages/investmentCalculator/inputs/ReturnRateInput.vue'
import CompoundFrequencySelector from '@/pages/investmentCalculator/inputs/CompoundFrequencySelector.vue'
import InvestmentSummaryCards from '@/pages/investmentCalculator/results/InvestmentSummaryCards.vue'
</script>

<template>
  <BaseBox
    class="w-full max-w-4xl rounded-[28px]"
    style="box-shadow: rgba(149, 157, 165, 0.18) 0px 20px 44px;"
  >
    <div class="flex flex-col gap-8 p-5 sm:p-8">

      <section class="space-y-5">

        <InitialInvestmentInput />
        <ContributionInput />
        <InvestmentTermInput />
        <ReturnRateInput />
        <CompoundFrequencySelector />
      </section>

      <section class="space-y-5 border-t border-app-subtle pt-8">
        <InvestmentSummaryCards />
      </section>
    </div>
  </BaseBox>
</template>
