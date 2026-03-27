<script setup lang="ts">
import { useReturnRate } from '@/composables/features/investment/useReturnRate'

import SectionCard from '@/components/shared/SectionCard.vue'
import InputField from '@/components/shared/InputField.vue'
import BaseButton from '@/components/base/ui/BaseButton.vue'
import BaseFlex from '@/components/base/layout/BaseFlex.vue'
import BaseDivider from '@/components/base/ui/BaseDivider.vue'

const {
  localValue,
  validationError,
  onInput,
  isPresetActive,
  selectPreset,
  presets,
} = useReturnRate()
</script>

<template>
  <BaseFlex col align="start" justify="between" gap="3">

    <!-- Rate input -->
    <div class="">
      <InputField label="Տարեկան եկամտաբերության դրույքաչափ" type="number" inputmode="decimal" placeholder="7"
        label-margin-top="" label-margin-bottom="-12px" :min="0" :max="100" :step="0.1" :model-value="localValue"
        :error="validationError" @update:model-value="onInput">
        <template #suffix>%</template>
      </InputField>
    </div>

    <!-- Preset buttons -->
    <BaseFlex gap="2" class="self-end">
      <BaseButton v-for="preset in presets" :key="preset.value" variant="preset" :active="isPresetActive(preset.value)"
        @click="selectPreset(preset.value)">
        {{ preset.label }}
      </BaseButton>
    </BaseFlex>
  </BaseFlex>
  <BaseDivider class="mt-5" />
</template>
