import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { GalleriaModule } from 'primeng/galleria';
import { DividerModule } from 'primeng/divider';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TagModule } from 'primeng/tag';
import { ConvertMinutesPipe } from '@pipes/convert-minutes.pipe';
import { CurrencyPipe, Location } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  imports: [
    ButtonModule,
    GalleriaModule,
    DividerModule,
    ScrollPanelModule,
    TagModule,
    ConvertMinutesPipe,
    CurrencyPipe
  ],
  encapsulation: ViewEncapsulation.None
})
export class DetailsComponent implements OnInit {
  programId!: string;
  images: any[] = [
    {
      source: 'https://placehold.co/200x150',
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
    {
      source:
        'https://upload.wikimedia.org/wikipedia/commons/6/6d/TFT-Pixel-Demo-Image-200x150.png',
      alt: 'Description for Image 2',
      title: 'Title 2'
    },
    {
      source: 'https://placehold.co/500x500',
      alt: 'Description for Image 3',
      title: 'Title 3'
    },
    {
      source: 'https://placehold.co/100x100',
      alt: 'Description for Image 4',
      title: 'Title 4'
    },
    {
      source: 'https://placehold.co/600x600',
      alt: 'Description for Image 5',
      title: 'Title 5'
    }
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  product = {
    id: 1,
    name: 'Product 1',
    price: 100,
    currency: 'BAM',
    duration: 165,
    description:
      'Description for Product 1 with id 1 and price 100 BAM and name Product 1 lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, varius velit. Sed sit amet urna at nulla eleifend pharetra at at nunc. Nulla facilisi. Nullam ac libero nec eros tincidunt aliquam nec    eu nunc. Nam sit amet nisl vel nunc luctus tristique. Donec nec nunc sit amet urna aliquet aliquam. Nulla facilisi. Nullam ac libero nec eros tincidunt aliquam nec eu nunc. Nam sit amet nisl vel nunc luctus tristique. Donec nec nunc sit amet urna aliquet aliquam. lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec purus feugiat, molestie ipsum et, varius velit. Sed sit amet urna at nulla eleifend pharetra at at nunc. Nulla facilisi. Nullam ac libero nec eros tincidunt aliquam nec eu nunc. Nam sit amet nisl vel nunc luctus tristique. Donec nec nunc sit amet urna aliquet aliquam. Nulla facilisi. Nullam ac libero nec eros tincidunt aliquam nec eu nunc. Nam sit amet nisl vel nunc luctus tristique. Donec nec nunc sit amet urna aliquet aliquam. djd sfsdfosdfjosdf',
    instructor: {
      name: 'Milan Ćelić'
    },
    location: {
      name: 'Sarajevo'
    },
    category: {
      name: 'Yoga'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {}
  ngOnInit(): void {
    this.programId = this.route.snapshot.paramMap.get('id') as string;
  }

  goBack() {
    this.location.back();
  }
}
