<template>
  <div class="node">
    <el-form >
      <template v-for="(val, key) in data" >
        <el-form-item>
          <div :key="key" class="item">
            <template v-if="typeof val !== 'object' || val === null">
              <span class="key">{{ key }}:</span>
              <el-input
                v-if="typeof val === 'string'"
                v-model="data[key]"
                @input="$emit('update')"
              />
              <el-input
                v-else-if="typeof val === 'number'"
                type="number"
                v-model.number="data[key]"
                @input="$emit('update')"
              />
              <el-select
                v-else-if="typeof val === 'boolean'"
                v-model="data[key]"
                @change="$emit('update')"
              >
                <option :value="true">true</option>
                <option :value="false">false</option>
              </el-select>
            </template>
            <div v-else class="sub">
              <b>{{ key }}:</b>
              <json-node :data="data[key]" @update="$emit('update')" />
            </div>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "JsonNode",
  props: ["data"]
};
</script>
