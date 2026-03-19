<script setup lang="ts">
import { useInvestmentStore } from '@/stores/investmentCalculator/investmentCalculator'
import { useInvestmentTerm }  from '@/composables/features/investment/useInvestmentTerm'
import { INVESTMENT_TERM_UNIT_OPTIONS } from '@/constants/investmentOptions'

import SectionCard  from '@/components/shared/SectionCard.vue'
import InputField   from '@/components/shared/InputField.vue'
import ToggleSwitch from '@/components/shared/ToggleSwitch.vue'
import BaseText     from '@/components/base/text/BaseText.vue'
import BaseFlex     from '@/components/base/layout/BaseFlex.vue'
import BaseButton   from '@/components/base/ui/BaseButton.vue'
import BaseDivider from '@/components/base/ui/BaseDivider.vue'

const store = useInvestmentStore()
const {
  localValue,
  validationError,
  termStep,
  termHint,
  onInput,
  onUnitChange,
  isPresetActive,
  selectPreset,
  presets,
} = useInvestmentTerm()
</script>

<template>
    <BaseFlex col align="stretch" gap="3">

      <ToggleSwitch
      class="self-end"
          :options="INVESTMENT_TERM_UNIT_OPTIONS"
          :model-value="store.termUnit"
          @update:model-value="onUnitChange"
        />

      <!-- Duration input + unit toggle -->
      <BaseFlex gap="3" align="end">
        <InputField
          label="Տևողություն"
          type="number"
          placeholder="10"
          label-margin-bottom="-15px"
          :model-value="localValue"
          :min="1"
          :step="termStep"
          :error="validationError"
          @update:model-value="onInput"
        />
      </BaseFlex>

      <!-- Preset year buttons -->
      <BaseFlex gap="2" wrap class="self-end">
        <BaseButton
          v-for="preset in presets"
          :key="preset.value"
          variant="preset"
          :active="isPresetActive(preset.value)"
          @click="selectPreset(preset.value)"
        >
          {{ preset.label }}
        </BaseButton>
      </BaseFlex>

      <!-- Hint -->
      <BaseText class="self-end" tag="p" variant="hint" color="MUTED">
        {{ termHint }}
      </BaseText>
    </BaseFlex>
    <BaseDivider/>
</template>
