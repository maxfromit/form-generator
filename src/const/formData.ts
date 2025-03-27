import type { FormCollection } from '@/components/FormGenerator/types'

export const hardcodedformData: FormCollection = {
  animals: {
    structure: [
      {
        id: 1,
        type: 'input',
        label: 'Animal Name',
        placeholder: 'Enter animal name',
        dataType: 'string',
      },
      {
        id: 2,
        type: 'select',
        label: 'Species',
        options: ['Dog', 'Cat', 'Bird', 'Fish', 'Reptile'],
      },
      {
        id: 3,
        type: 'checkbox',
        label: 'Is Endangered',
      },
      {
        id: 4,
        type: 'textarea',
        label: 'Habitat Description',
        placeholder: 'Describe the habitat',
      },
    ],
    values: ['Tiger', 'Reptile', true, 'Dense forests and grasslands'],
  },
  recipes: {
    structure: [
      {
        id: 1,
        type: 'input',
        label: 'Recipe Name',
        placeholder: 'Enter recipe name',
        dataType: 'string',
      },
      {
        id: 2,
        type: 'textarea',
        label: 'Ingredients',
        placeholder: 'List all ingredients',
      },
      {
        id: 3,
        type: 'textarea',
        label: 'Instructions',
        placeholder: 'Describe the steps',
      },
      {
        id: 4,
        type: 'checkbox',
        label: 'Is Vegetarian',
      },
    ],
    values: [
      'Pasta Primavera',
      'Pasta, Vegetables, Olive Oil',
      'Cook pasta, sauté vegetables, mix together.',
      true,
    ],
  },
  movies: {
    structure: [
      {
        id: 1,
        type: 'input',
        label: 'Movie Title',
        placeholder: 'Enter movie title',
        dataType: 'string',
      },
      {
        id: 2,
        type: 'input',
        label: 'Director',
        placeholder: 'Enter director name',
        dataType: 'string',
      },
      {
        id: 3,
        type: 'textarea',
        label: 'Synopsis',
        placeholder: 'Write a brief synopsis',
      },
      {
        id: 4,
        type: 'select',
        label: 'Genre',
        options: ['Action', 'Drama', 'Comedy', 'Horror', 'Sci-Fi'],
      },
    ],
    values: [
      'Inception',
      'Christopher Nolan',
      'A mind-bending thriller about dreams within dreams.',
      'Sci-Fi',
    ],
  },
  gadgets: {
    structure: [
      {
        id: 1,
        type: 'input',
        label: 'Gadget Name',
        placeholder: 'Enter gadget name',
        dataType: 'string',
      },
      {
        id: 2,
        type: 'input',
        label: 'Brand',
        placeholder: 'Enter brand name',
        dataType: 'string',
      },
      {
        id: 3,
        type: 'textarea',
        label: 'Features',
        placeholder: 'List the key features',
      },
      {
        id: 4,
        type: 'checkbox',
        label: 'Is Waterproof',
      },
    ],
    values: [
      'Smartwatch',
      'TechBrand',
      'Tracks fitness, shows notifications, long battery life.',
      true,
    ],
  },
}
