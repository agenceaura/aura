import 'dart:ui' as ui;
import 'package:flutter/material.dart';

/// A premium, high-performance Aura widget for Agence Aura using SPIR-V Fragment Shaders.
/// Implements RGB Displacement and Refraction interactive effects.
class AuraBackground extends StatefulWidget {
  const AuraBackground({super.key});

  @override
  State<AuraBackground> createState() => _AuraBackgroundState();
}

class _AuraBackgroundState extends State<AuraBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  ui.FragmentShader? _shader;
  Offset _mousePosition = Offset.zero;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 10),
    )..repeat();
    
    _loadShader();
  }

  Future<void> _loadShader() async {
    try {
      // NOTE: Ensure 'shaders/aura.frag' is properly compiled to SPIR-V and added to pubspec.yaml assets!
      final program = await ui.FragmentProgram.fromAsset('shaders/aura.frag');
      setState(() {
        _shader = program.fragmentShader();
      });
    } catch (e) {
      debugPrint("Error loading shader: $e");
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_shader == null) {
      return Container(color: const Color(0xFF030305));
    }

    return MouseRegion(
      onHover: (event) {
        setState(() {
          _mousePosition = event.localPosition;
        });
      },
      child: Stack(
        children: [
          // Background Layer
          Positioned.fill(
            child: Container(color: const Color(0xFF030305)),
          ),
          
          // Shaders / Aura Layer
          Positioned.fill(
            child: AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return CustomPaint(
                  painter: AuraShaderPainter(
                    shader: _shader!,
                    time: _controller.value * 10.0, // Scale time for animation
                    mouse: _mousePosition,
                  ),
                );
              },
            ),
          ),
          
          // UI Overlays (The visual tags)
          Positioned(
            top: 100,
            left: 50,
            child: _buildTag("INTERACTIVE DESIGN"),
          ),
          Positioned(
            bottom: 100,
            right: 50,
            child: _buildTag("IMMERSIVE UX"),
          ),
        ],
      ),
    );
  }

  Widget _buildTag(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white10),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: Colors.white70,
          fontSize: 10,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.5,
        ),
      ),
    );
  }
}

class AuraShaderPainter extends CustomPainter {
  final ui.FragmentShader shader;
  final double time;
  final Offset mouse;

  AuraShaderPainter({
    required this.shader,
    required this.time,
    required this.mouse,
  });

  @override
  void paint(Canvas canvas, Size size) {
    // Uniforms mapping:
    // 0: uTime
    // 1, 2: uResolution (x, y)
    // 3, 4: uMouse (x, y)
    shader.setFloat(0, time);
    shader.setFloat(1, size.width);
    shader.setFloat(2, size.height);
    shader.setFloat(3, mouse.dx);
    shader.setFloat(4, mouse.dy);

    final paint = Paint()..shader = shader;
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant AuraShaderPainter oldDelegate) {
    return oldDelegate.time != time || oldDelegate.mouse != mouse;
  }
}
