<script setup lang="ts">
import { computed } from 'vue'
import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { COMPOUND_FREQUENCY_OPTIONS } from '@/constants/investmentOptions'
import type { CompoundFrequency } from '@/types/investment'
import { COLORS } from '@/constants/colors'

import SectionCard from '@/components/shared/SectionCard.vue'
import BaseButton  from '@/components/base/ui/BaseButton.vue'
import BaseText    from '@/components/base/text/BaseText.vue'
import BaseFlex    from '@/components/base/layout/BaseFlex.vue'

const store = useInvestmentStore()

const activeMap = computed(() =>
  Object.fromEntries(
    COMPOUND_FREQUENCY_OPTIONS.map((opt) => [opt.value, store.compoundFreq === opt.value]),
  ),
)
</script>

<template>
  <SectionCard title="Տոկոսների կապիտալացման պարբերականություն">
    <div class="grid grid-cols-2 gap-3">
      <BaseButton
        v-for="opt in COMPOUND_FREQUENCY_OPTIONS"
        :key="opt.value"
        variant="card-select"
        :active="activeMap[opt.value]"
        @click="store.compoundFreq = opt.value as CompoundFrequency"
      >
        <BaseFlex gap="2" class="mb-1">
          <BaseText variant="icon-glyph" :rawColor="activeMap[opt.value] ? COLORS.ACCENT : COLORS.MUTED">
            {{ opt.icon }}
          </BaseText>
          <BaseText variant="card-title" :rawColor="activeMap[opt.value] ? COLORS.CONTENT : COLORS.MUTED">
            {{ opt.label }}
          </BaseText>
        </BaseFlex>
      </BaseButton>
    </div>
  </SectionCard>
</template>
